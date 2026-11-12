const { hashPassword: hashSenhaSegura, normalizeEmail, verifyPassword } = require('./auth-service');

function normalizarEmail(email) {
  return normalizeEmail(email);
}

function gerarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function hashPassword(senha) {
  return hashSenhaSegura(senha);
}

function verificarSenha(senha, hash) {
  return verifyPassword(senha, hash);
}

module.exports = { normalizarEmail, gerarId, hashPassword, verificarSenha };
