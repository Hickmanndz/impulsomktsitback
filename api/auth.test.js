const assert = require('node:assert/strict');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { after, before, test } = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const serverPath = path.join(projectRoot, 'server.js');
let dataDirectory;
let serverProcess;
let baseUrl;
let serverOutput = '';

async function findAvailablePort() {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once('error', reject);
    listener.listen(0, '127.0.0.1', resolve);
  });
  const { port } = listener.address();
  await new Promise((resolve) => listener.close(resolve));
  return port;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`O servidor encerrou antes de iniciar. ${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (erro) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error(`O servidor não respondeu ao health check. ${serverOutput}`);
}

function cookieFrom(response) {
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie, 'o servidor deve emitir o cookie da sessão');
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  return cookie.split(';', 1)[0];
}

async function postJson(route, body, cookie) {
  return fetch(`${baseUrl}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {})
    },
    body: JSON.stringify(body)
  });
}

before(async () => {
  dataDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'impulso-auth-test-'));
  const port = await findAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  serverProcess = spawn(process.execPath, [serverPath], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: String(port),
      IMPULSO_DATA_DIR: dataDirectory
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  serverProcess.stdout.on('data', (data) => { serverOutput += data.toString(); });
  serverProcess.stderr.on('data', (data) => { serverOutput += data.toString(); });
  await waitForServer();
});

after(() => {
  if (serverProcess && serverProcess.exitCode === null) {
    serverProcess.kill();
  }
  if (dataDirectory) {
    fs.rmSync(dataDirectory, { recursive: true, force: true });
  }
});

test('registers, authenticates, changes password and invalidates the session on logout', async () => {
  const email = `auth-${process.pid}@example.test`;
  const password = 'first-password-123';
  const registerResponse = await postJson('/api/auth/register', {
    nome: 'Test User',
    email,
    senha: password
  });

  assert.equal(registerResponse.status, 201);
  const registeredUser = (await registerResponse.json()).user;
  assert.equal(registeredUser.email, email);
  assert.equal(Object.hasOwn(registeredUser, 'senha'), false);
  const registerCookie = cookieFrom(registerResponse);

  const currentSession = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: registerCookie }
  });
  assert.equal(currentSession.status, 200);

  const profileResponse = await postJson('/api/auth/profile', {
    nomeProfissional: 'Oficina do Teste',
    categoria: 'Marceneiro artesanal',
    descricao: 'Móveis sob medida.'
  }, registerCookie);
  assert.equal(profileResponse.status, 200);
  assert.equal((await profileResponse.json()).user.categoria, 'Marceneiro artesanal');

  const persistedProfessionalProfile = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: registerCookie }
  });
  assert.equal((await persistedProfessionalProfile.json()).user.categoria, 'Marceneiro artesanal');

  const unauthorizedPhoto = await postJson('/api/auth/profile-photo', {
    foto: 'data:image/jpeg;base64,/9j/2Q=='
  });
  assert.equal(unauthorizedPhoto.status, 401);

  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0x00, 0xff, 0xd9]).toString('base64');
  const photoResponse = await postJson('/api/auth/profile-photo', {
    foto: `data:image/jpeg;base64,${jpeg}`
  }, registerCookie);
  assert.equal(photoResponse.status, 200);
  assert.equal((await photoResponse.json()).user.foto, `data:image/jpeg;base64,${jpeg}`);

  const persistedProfile = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: registerCookie }
  });
  assert.equal((await persistedProfile.json()).user.foto, `data:image/jpeg;base64,${jpeg}`);

  const invalidPhoto = await postJson('/api/auth/profile-photo', {
    foto: 'data:image/jpeg;base64,ZmFrZQ=='
  }, registerCookie);
  assert.equal(invalidPhoto.status, 400);

  const removePhoto = await postJson('/api/auth/profile-photo', { foto: null }, registerCookie);
  assert.equal(removePhoto.status, 200);
  assert.equal(Object.hasOwn((await removePhoto.json()).user, 'foto'), false);

  const wrongLogin = await postJson('/api/auth/login', { email, senha: 'wrong-password' });
  assert.equal(wrongLogin.status, 401);

  const wrongPasswordChange = await postJson('/api/auth/change-password', {
    senhaAtual: 'wrong-password',
    novaSenha: 'updated-password-456'
  }, registerCookie);
  assert.equal(wrongPasswordChange.status, 401);

  const passwordChange = await postJson('/api/auth/change-password', {
    senhaAtual: password,
    novaSenha: 'updated-password-456'
  }, registerCookie);
  assert.equal(passwordChange.status, 200);

  const oldPasswordLogin = await postJson('/api/auth/login', { email, senha: password });
  assert.equal(oldPasswordLogin.status, 401);

  const newPasswordLogin = await postJson('/api/auth/login', {
    email: email.toUpperCase(),
    senha: 'updated-password-456'
  });
  assert.equal(newPasswordLogin.status, 200);
  const loginCookie = cookieFrom(newPasswordLogin);

  const logoutResponse = await postJson('/api/auth/logout', {}, loginCookie);
  assert.equal(logoutResponse.status, 200);

  const expiredSession = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: loginCookie }
  });
  assert.equal(expiredSession.status, 401);

  const googleResponse = await postJson('/api/auth/google', { email, nome: 'Fake Google' });
  assert.equal(googleResponse.status, 404);

  const database = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'impulso-db.json'), 'utf8'));
  const savedUser = database.users.find((user) => user.email === email);
  assert.match(savedUser.senha, /^scrypt\$/);
  assert.notEqual(savedUser.senha, 'updated-password-456');

  const unauthorizedUsers = await fetch(`${baseUrl}/api/admin/users`);
  assert.equal(unauthorizedUsers.status, 403);

  const adminLogin = await postJson('/api/auth/login', {
    email: 'admin@impulso.com',
    senha: 'admin123'
  });
  const adminCookie = cookieFrom(adminLogin);
  const adminUsersResponse = await fetch(`${baseUrl}/api/admin/users`, {
    headers: { Cookie: adminCookie }
  });
  assert.equal(adminUsersResponse.status, 200);
  const adminUsers = (await adminUsersResponse.json()).users;
  const listedUser = adminUsers.find((user) => user.email === email);
  assert.ok(listedUser);
  assert.equal(Object.hasOwn(listedUser, 'senha'), false);
});