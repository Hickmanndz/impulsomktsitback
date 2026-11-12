const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  hashPassword,
  isLegacyPasswordHash,
  normalizeEmail,
  verifyPassword
} = require('./api/helpers/auth-service');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = process.env.IMPULSO_DATA_DIR
  ? path.resolve(process.env.IMPULSO_DATA_DIR)
  : path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'impulso-db.json');
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@impulso.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const DEFAULT_DB = {
  users: [],
  posts: [],
  payments: [],
  sessions: []
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function isAdminUser(user) {
  if (!user) {
    return false;
  }

  if (user.isAdmin === true) {
    return true;
  }

  return normalizeEmail(user.email) === normalizeEmail(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL);
}

function readDb() {
  ensureDataDir();

  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }

    const raw = fs.readFileSync(DB_FILE, 'utf8');
    if (!raw.trim()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_DB));
    }

    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : []
    };
  } catch (erro) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }
}

function writeDb(db) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { senha, hashSenha, ...dados } = user;
  return {
    ...dados,
    isAdmin: Boolean(dados.isAdmin || isAdminUser(user))
  };
}

function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

function createSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Payload muito grande.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (erro) {
        reject(new Error('JSON inválido.'));
      }
    });

    req.on('error', reject);
  });
}

function getSessionFromRequest(req) {
  const cookies = String(req.headers.cookie || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const [chave, ...valor] = item.split('=');
      acc[chave] = valor.join('=');
      return acc;
    }, {});

  return cookies.impulso_session || null;
}

function authUser(req, db) {
  const sessionId = getSessionFromRequest(req);

  if (!sessionId) {
    return null;
  }

  const session = db.sessions.find((item) => item.id === sessionId);
  if (!session) {
    return null;
  }

  if (Date.now() > new Date(session.expiresAt).getTime()) {
    db.sessions = db.sessions.filter((item) => item.id !== sessionId);
    writeDb(db);
    return null;
  }

  const user = db.users.find((item) => String(item.id) === String(session.userId));
  return user || null;
}

function setSessionCookie(req, res, sessionId) {
  const secure = req.socket && req.socket.encrypted ? '; Secure' : '';
  res.setHeader('Set-Cookie', `impulso_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${secure}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'impulso_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function serveStaticFile(req, res, pathname) {
  const safePath = path.normalize(path.join(ROOT, pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')));

  if (!safePath.startsWith(ROOT)) {
    jsonResponse(res, 403, { error: 'Acesso negado.' });
    return;
  }

  fs.readFile(safePath, (erro, dados) => {
    if (erro) {
      jsonResponse(res, 404, { error: 'Arquivo não encontrado.' });
      return;
    }

    const extension = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    res.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    });
    res.end(dados);
  });
}

async function tryCreateMercadoPagoPayment({ user, plano, valor, metodo }) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return null;
  }

  try {
    const baseUrl = process.env.MERCADO_PAGO_BASE_URL || 'https://api.mercadopago.com';
    const response = await fetch(`${baseUrl}/v1/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction_amount: Number(valor || 0),
        description: `Plano ${plano}`,
        payment_method_id: metodo === 'cartao' ? 'visa' : 'pix',
        payer: {
          email: user.email,
          first_name: user.nome || 'Usuário'
        },
        metadata: {
          userId: user.id,
          plano
        }
      })
    });

    if (!response.ok) {
      const texto = await response.text();
      throw new Error(texto || 'Erro ao criar pagamento externo.');
    }

    return await response.json();
  } catch (erro) {
    console.warn('Mercado Pago indisponível, usando fluxo local:', erro.message || erro);
    return null;
  }
}

function ensureDefaultAdmin() {
  const db = readDb();
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL);
  const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  let usuarioAdmin = db.users.find((usuario) => normalizeEmail(usuario.email) === adminEmail);

  if (!usuarioAdmin) {
    usuarioAdmin = {
      id: createId('admin'),
      nome: 'Administrador',
      email: adminEmail,
      senha: hashPassword(adminPassword),
      plano: 'Premium',
      isAdmin: true,
      criadoEm: new Date().toISOString(),
      planoInicio: new Date().toISOString(),
      planoValidoAte: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    db.users.unshift(usuarioAdmin);
    writeDb(db);
    return;
  }

  usuarioAdmin.isAdmin = true;
  if (!usuarioAdmin.senha) {
    usuarioAdmin.senha = hashPassword(adminPassword);
  }
  usuarioAdmin.plano = usuarioAdmin.plano || 'Premium';
  writeDb(db);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'OPTIONS') {
    jsonResponse(res, 204, {});
    return;
  }

  const pathname = url.pathname;

  if (pathname === '/api/health') {
    jsonResponse(res, 200, { ok: true, status: 'online' });
    return;
  }

  if (pathname === '/api/plans') {
    const planos = {
      Basico: {
        preco: 10,
        limitePosts: 3,
        destaque: false,
        prioridade: false,
        selo: false,
        premium: false,
        descricao: 'Plano inicial para começar sua divulgação.'
      },
      Destaque: {
        preco: 20,
        limitePosts: 10,
        destaque: true,
        prioridade: true,
        selo: true,
        premium: false,
        descricao: 'Mais visibilidade e prioridade.'
      },
      Premium: {
        preco: 40,
        limitePosts: Infinity,
        destaque: true,
        prioridade: true,
        selo: true,
        premium: true,
        descricao: 'Máxima exposição para seu trabalho.'
      }
    };

    jsonResponse(res, 200, { planos });
    return;
  }

  if (pathname === '/api/config/payment') {
    const providerConfigured = Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN);
    jsonResponse(res, 200, {
      provider: providerConfigured ? 'mercadopago' : 'manual',
      configured: providerConfigured,
      status: providerConfigured ? 'integrado' : 'manual-review',
      sandbox: String(process.env.MERCADO_PAGO_SANDBOX || 'true') === 'true'
    });
    return;
  }

  if (pathname === '/api/auth/register') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    try {
      const body = await parseBody(req);
      const nome = String(body.nome || '').trim();
      const email = normalizeEmail(body.email);
      const senha = String(body.senha || '');

      if (!nome || !email || !senha) {
        jsonResponse(res, 400, { error: 'Nome, e-mail e senha são obrigatórios.' });
        return;
      }

      if (nome.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || senha.length < 8 || senha.length > 128) {
        jsonResponse(res, 400, { error: 'Informe um nome válido, um e-mail válido e uma senha de 8 a 128 caracteres.' });
        return;
      }

      const db = readDb();
      const jaExiste = db.users.some((usuario) => normalizeEmail(usuario.email) === email);
      if (jaExiste) {
        jsonResponse(res, 409, { error: 'Este e-mail já está cadastrado.' });
        return;
      }

      const usuario = {
        id: createId('user'),
        nome,
        email,
        senha: hashPassword(senha),
        plano: null,
        criadoEm: new Date().toISOString(),
        planoInicio: null,
        planoValidoAte: null,
        isAdmin: false
      };

      db.users.push(usuario);
      writeDb(db);

      const sessionId = createSessionId();
      db.sessions.push({
        id: sessionId,
        userId: usuario.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
      });
      writeDb(db);

      setSessionCookie(req, res, sessionId);
      jsonResponse(res, 201, { user: sanitizeUser(usuario) });
    } catch (erro) {
      jsonResponse(res, 400, { error: erro.message || 'Não foi possível registrar o usuário.' });
    }
    return;
  }

  if (pathname === '/api/auth/login') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    try {
      const body = await parseBody(req);
      const email = normalizeEmail(body.email);
      const senha = String(body.senha || '');

      if (!email || !senha) {
        jsonResponse(res, 400, { error: 'E-mail e senha são obrigatórios.' });
        return;
      }

      const db = readDb();
      const usuario = db.users.find((item) => normalizeEmail(item.email) === email);
      if (!usuario || !verifyPassword(senha, usuario.senha)) {
        jsonResponse(res, 401, { error: 'Credenciais inválidas.' });
        return;
      }

      if (isLegacyPasswordHash(usuario.senha)) {
        usuario.senha = hashPassword(senha);
      }

      const sessionId = createSessionId();
      db.sessions = db.sessions.filter((item) => String(item.userId) !== String(usuario.id));
      db.sessions.push({
        id: sessionId,
        userId: usuario.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
      });
      writeDb(db);

      setSessionCookie(req, res, sessionId);
      jsonResponse(res, 200, { user: sanitizeUser(usuario) });
    } catch (erro) {
      jsonResponse(res, 400, { error: erro.message || 'Não foi possível fazer login.' });
    }
    return;
  }

  if (pathname === '/api/auth/change-password') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    try {
      const db = readDb();
      const usuario = authUser(req, db);
      if (!usuario) {
        jsonResponse(res, 401, { error: 'Sua sessão expirou. Entre novamente.' });
        return;
      }

      const body = await parseBody(req);
      const senhaAtual = String(body.senhaAtual || '');
      const novaSenha = String(body.novaSenha || '');

      if (!verifyPassword(senhaAtual, usuario.senha)) {
        jsonResponse(res, 401, { error: 'A senha atual está incorreta.' });
        return;
      }

      if (novaSenha.length < 8 || novaSenha.length > 128) {
        jsonResponse(res, 400, { error: 'A nova senha deve ter de 8 a 128 caracteres.' });
        return;
      }

      usuario.senha = hashPassword(novaSenha);
      writeDb(db);
      jsonResponse(res, 200, { user: sanitizeUser(usuario) });
    } catch (erro) {
      jsonResponse(res, 400, { error: erro.message || 'Não foi possível alterar a senha.' });
    }
    return;
  }

  if (pathname === '/api/auth/logout') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    const db = readDb();
    const sessionId = getSessionFromRequest(req);
    if (sessionId) {
      db.sessions = db.sessions.filter((item) => item.id !== sessionId);
      writeDb(db);
    }

    clearSessionCookie(res);
    jsonResponse(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/auth/me') {
    if (req.method !== 'GET') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario) {
      jsonResponse(res, 401, { error: 'Sessão não encontrada.' });
      return;
    }

    jsonResponse(res, 200, { user: sanitizeUser(usuario) });
    return;
  }

  if (pathname === '/api/auth/profile-photo') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario) {
      jsonResponse(res, 401, { error: 'Sua sessão expirou. Entre novamente.' });
      return;
    }

    try {
      const body = await parseBody(req);
      if (body.foto === null) {
        delete usuario.foto;
        writeDb(db);
        jsonResponse(res, 200, { user: sanitizeUser(usuario) });
        return;
      }

      const foto = typeof body.foto === 'string' ? body.foto : '';
      const match = foto.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!match || foto.length > 700 * 1024) {
        jsonResponse(res, 400, { error: 'A foto precisa ser uma imagem JPEG válida de até 512 KB.' });
        return;
      }

      const imagem = Buffer.from(match[1], 'base64');
      const jpegValido = imagem.length >= 4
        && imagem.length <= 512 * 1024
        && imagem.toString('base64') === match[1]
        && imagem[0] === 0xff
        && imagem[1] === 0xd8
        && imagem[2] === 0xff
        && imagem[imagem.length - 2] === 0xff
        && imagem[imagem.length - 1] === 0xd9;

      if (!jpegValido) {
        jsonResponse(res, 400, { error: 'O arquivo enviado não é um JPEG válido.' });
        return;
      }

      usuario.foto = foto;
      writeDb(db);
      jsonResponse(res, 200, { user: sanitizeUser(usuario) });
    } catch (erro) {
      jsonResponse(res, 400, { error: erro.message || 'Não foi possível salvar a foto.' });
    }
    return;
  }

  if (pathname === '/api/auth/profile') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario) {
      jsonResponse(res, 401, { error: 'Sua sessão expirou. Entre novamente.' });
      return;
    }

    try {
      const body = await parseBody(req);
      const nomeProfissional = String(body.nomeProfissional || '').trim();
      const categoria = String(body.categoria || '').trim();
      const descricao = String(body.descricao || '').trim();

      if (!nomeProfissional || !categoria || nomeProfissional.length > 80 || categoria.length > 60 || descricao.length > 500) {
        jsonResponse(res, 400, { error: 'Informe nome profissional e profissão válidos; a descrição pode ter até 500 caracteres.' });
        return;
      }

      usuario.nomeProfissional = nomeProfissional;
      usuario.categoria = categoria;
      usuario.descricao = descricao;
      writeDb(db);
      jsonResponse(res, 200, { user: sanitizeUser(usuario) });
    } catch (erro) {
      jsonResponse(res, 400, { error: erro.message || 'Não foi possível salvar o perfil.' });
    }
    return;
  }

  if (pathname === '/api/posts') {
    const db = readDb();

    if (req.method === 'GET') {
      const posts = db.posts.slice().sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
      jsonResponse(res, 200, { posts });
      return;
    }

    if (req.method === 'POST') {
      const usuario = authUser(req, db);
      if (!usuario) {
        jsonResponse(res, 401, { error: 'É necessário estar logado para criar uma publicação.' });
        return;
      }

      try {
        const body = await parseBody(req);
        const titulo = String(body.titulo || body.post?.titulo || '').trim();
        const descricao = String(body.descricao || body.post?.descricao || '').trim();

        if (!titulo || !descricao) {
          jsonResponse(res, 400, { error: 'Título e descrição são obrigatórios.' });
          return;
        }

        const post = {
          id: createId('post'),
          email: usuario.email,
          usuarioId: usuario.id,
          nome: body.nome || usuario.nome || 'Usuário',
          titulo,
          descricao,
          categoria: body.categoria || body.post?.categoria || 'Geral',
          contato: body.contato || body.post?.contato || '',
          plano: usuario.plano || 'Básico',
          visualizacoes: 0,
          criadoEm: new Date().toISOString()
        };

        db.posts.unshift(post);
        writeDb(db);
        jsonResponse(res, 201, { post });
      } catch (erro) {
        jsonResponse(res, 400, { error: erro.message || 'Não foi possível salvar o post.' });
      }
      return;
    }

    jsonResponse(res, 405, { error: 'Método não permitido.' });
    return;
  }

  if (pathname === '/api/payments') {
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { error: 'Método não permitido.' });
      return;
    }

    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario) {
      jsonResponse(res, 401, { error: 'Sessão não encontrada.' });
      return;
    }

    try {
      const body = await parseBody(req);
      const plano = String(body.plano || '').trim();
      const metodo = String(body.metodo || 'pix').trim();
      const valor = Number(body.valor || 0);

      if (!plano) {
        jsonResponse(res, 400, { error: 'Plano é obrigatório.' });
        return;
      }

      const pagamento = {
        id: createId('pay'),
        usuarioId: usuario.id,
        usuarioEmail: usuario.email,
        usuarioNome: usuario.nome,
        plano,
        valor,
        metodo,
        status: 'pending',
        detalhes: { ...(body.detalhes || {}), provider: process.env.MERCADO_PAGO_ACCESS_TOKEN ? 'mercadopago' : 'manual' },
        criadoEm: new Date().toISOString(),
        confirmadoEm: null,
        planoValidoAte: null
      };

      const externalPayment = await tryCreateMercadoPagoPayment({ user: usuario, plano, valor, metodo });
      if (externalPayment) {
        pagamento.detalhes.externalPaymentId = externalPayment.id;
        pagamento.detalhes.provider = 'mercadopago';
        pagamento.status = String(externalPayment.status || 'pending').toLowerCase() === 'approved' ? 'approved' : 'pending';

        if (pagamento.status === 'approved') {
          pagamento.confirmadoEm = new Date().toISOString();
          pagamento.planoValidoAte = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          usuario.plano = pagamento.plano;
          usuario.planoInicio = new Date().toISOString();
          usuario.planoValidoAte = pagamento.planoValidoAte;
        }
      }

      db.payments.unshift(pagamento);
      writeDb(db);
      jsonResponse(res, 201, { payment: pagamento, user: sanitizeUser(usuario) });
    } catch (erro) {
      jsonResponse(res, 400, { error: erro.message || 'Não foi possível criar o pagamento.' });
    }
    return;
  }

  if (pathname === '/api/admin/dashboard') {
    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario || !isAdminUser(usuario)) {
      jsonResponse(res, 403, { error: 'Acesso restrito ao administrador.' });
      return;
    }

    const summary = {
      totalUsuarios: db.users.length,
      totalPosts: db.posts.length,
      totalPagamentos: db.payments.length,
      pagamentosPendentes: db.payments.filter((item) => String(item.status || '').toLowerCase() === 'pending').length,
      totalAdminUsuarios: db.users.filter((item) => isAdminUser(item)).length
    };

    jsonResponse(res, 200, {
      summary,
      users: db.users.slice(0, 10).map((item) => sanitizeUser(item)),
      payments: db.payments.slice(0, 10)
    });
    return;
  }

  if (pathname === '/api/admin/users') {
    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario || !isAdminUser(usuario)) {
      jsonResponse(res, 403, { error: 'Acesso restrito ao administrador.' });
      return;
    }

    jsonResponse(res, 200, { users: db.users.map((item) => sanitizeUser(item)) });
    return;
  }

  if (pathname === '/api/admin/payments') {
    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario || !isAdminUser(usuario)) {
      jsonResponse(res, 403, { error: 'Acesso restrito ao administrador.' });
      return;
    }

    jsonResponse(res, 200, { payments: db.payments });
    return;
  }

  const matchConfirm = pathname.match(/^\/api\/payments\/([^/]+)\/confirm$/);
  if (matchConfirm && req.method === 'POST') {
    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario) {
      jsonResponse(res, 401, { error: 'Sessão não encontrada.' });
      return;
    }

    const pagamentoId = decodeURIComponent(matchConfirm[1]);
    const pagamento = db.payments.find((item) => String(item.id) === String(pagamentoId));
    if (!pagamento) {
      jsonResponse(res, 404, { error: 'Pagamento não encontrado.' });
      return;
    }

    if (String(pagamento.usuarioId) !== String(usuario.id) && !isAdminUser(usuario)) {
      jsonResponse(res, 403, { error: 'Você não pode confirmar este pagamento.' });
      return;
    }

    pagamento.status = 'approved';
    pagamento.confirmadoEm = new Date().toISOString();
    pagamento.planoValidoAte = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const usuarioDb = db.users.find((item) => String(item.id) === String(pagamento.usuarioId));
    if (usuarioDb) {
      usuarioDb.plano = pagamento.plano;
      usuarioDb.planoInicio = new Date().toISOString();
      usuarioDb.planoValidoAte = pagamento.planoValidoAte;
    }

    writeDb(db);
    jsonResponse(res, 200, { payment: pagamento, user: sanitizeUser(usuarioDb) });
    return;
  }

  const matchAdminApprove = pathname.match(/^\/api\/admin\/payments\/([^/]+)\/(approve|reject)$/);
  if (matchAdminApprove && req.method === 'POST') {
    const db = readDb();
    const usuario = authUser(req, db);
    if (!usuario || !isAdminUser(usuario)) {
      jsonResponse(res, 403, { error: 'Acesso restrito ao administrador.' });
      return;
    }

    const pagamentoId = decodeURIComponent(matchAdminApprove[1]);
    const pagamento = db.payments.find((item) => String(item.id) === String(pagamentoId));
    if (!pagamento) {
      jsonResponse(res, 404, { error: 'Pagamento não encontrado.' });
      return;
    }

    const acao = matchAdminApprove[2];
    if (acao === 'approve') {
      pagamento.status = 'approved';
      pagamento.confirmadoEm = new Date().toISOString();
      pagamento.planoValidoAte = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const usuarioDb = db.users.find((item) => String(item.id) === String(pagamento.usuarioId));
      if (usuarioDb) {
        usuarioDb.plano = pagamento.plano;
        usuarioDb.planoInicio = new Date().toISOString();
        usuarioDb.planoValidoAte = pagamento.planoValidoAte;
      }
    } else {
      pagamento.status = 'rejected';
      pagamento.confirmadoEm = null;
      pagamento.planoValidoAte = null;
    }

    writeDb(db);
    jsonResponse(res, 200, { payment: pagamento });
    return;
  }

  if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile(req, res, '/index.html');
    return;
  }

  serveStaticFile(req, res, pathname);
});

ensureDefaultAdmin();

server.listen(PORT, () => {
  console.log(`Servidor Impulso MKT rodando em http://localhost:${PORT}`);
  console.log(`Admin padrão: ${DEFAULT_ADMIN_EMAIL}`);
});
