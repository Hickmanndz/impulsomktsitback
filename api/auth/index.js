const { normalizarEmail, hashPassword, verificarSenha } = require('../helpers');

function login({ email, senha, usuarios = [] }) {
  if (!email || !senha) {
    throw new Error('E-mail e senha são obrigatórios.');
  }

  const usuario = usuarios.find((item) => normalizarEmail(item.email) === normalizarEmail(email));

  if (!usuario) {
    throw new Error('Credenciais inválidas.');
  }

  const senhaValida = verificarSenha(senha, usuario.senha || usuario.hashSenha || '');
  if (!senhaValida) {
    throw new Error('Credenciais inválidas.');
  }

  const { senha, hashSenha, ...dadosPublicos } = usuario;
  return dadosPublicos;
}

function registerUser({ nome, email, senha, usuarios = [] }) {
  if (!nome || !email || !senha) {
    throw new Error('Nome, e-mail e senha são obrigatórios.');
  }

  const emailNormalizado = normalizarEmail(email);
  const jaExiste = usuarios.some((usuario) => normalizarEmail(usuario.email) === emailNormalizado);

  if (jaExiste) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const usuario = {
    id: Date.now() + '-' + Math.random().toString(16).slice(2),
    nome: String(nome).trim(),
    email: emailNormalizado,
    senha: hashPassword(senha),
    plano: null,
    criadoEm: new Date().toISOString()
  };

  usuarios.push(usuario);
  const { senha, hashSenha, ...dadosPublicos } = usuario;
  return dadosPublicos;
}

function logout() {
  return true;
}

module.exports = { login, registerUser, logout };
