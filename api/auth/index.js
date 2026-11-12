const { normalizarEmail } = require('../helpers');

function login({ email, senha, usuarios = [] }) {
  if (!email || !senha) {
    throw new Error('E-mail e senha são obrigatórios.');
  }

  const usuario = usuarios.find((item) => normalizarEmail(item.email) === normalizarEmail(email));

  if (!usuario || String(usuario.senha) !== String(senha)) {
    throw new Error('Credenciais inválidas.');
  }

  return usuario;
}

function logout() {
  return true;
}

module.exports = { login, logout };
