const { normalizarEmail, gerarId } = require('../helpers');

function registerUser({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw new Error('Nome, e-mail e senha são obrigatórios.');
  }

  const usuarios = obterUsuarios();
  const emailNormalizado = normalizarEmail(email);

  const jaExiste = usuarios.some((usuario) => normalizarEmail(usuario.email) === emailNormalizado);
  if (jaExiste) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const usuario = {
    id: gerarId(),
    nome: String(nome).trim(),
    email: emailNormalizado,
    senha: String(senha),
    plano: null,
    criadoEm: new Date().toISOString()
  };

  usuarios.push(usuario);
  salvarUsuarios(usuarios);
  return usuario;
}

function obterUsuarios() {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem('impulsoUsuarios') || '[]');
  } catch (erro) {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('impulsoUsuarios', JSON.stringify(usuarios));
  }
}

module.exports = { registerUser, obterUsuarios, salvarUsuarios };
