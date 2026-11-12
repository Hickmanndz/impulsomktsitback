const { normalizarEmail, gerarId } = require('../helpers');

function createPost({ user, post }) {
  if (!user || !user.email) {
    throw new Error('É necessário estar logado para criar uma publicação.');
  }

  const dadosPost = {
    id: gerarId(),
    email: normalizarEmail(user.email),
    usuarioId: user.id || null,
    nome: (post && post.nome) ? String(post.nome).trim() : (user.nome || 'Usuário'),
    titulo: (post && post.titulo) ? String(post.titulo).trim() : 'Publicação',
    descricao: (post && post.descricao) ? String(post.descricao).trim() : '',
    categoria: (post && post.categoria) ? String(post.categoria).trim() : 'Geral',
    contato: (post && post.contato) ? String(post.contato).trim() : '',
    plano: (post && post.plano) ? String(post.plano) : 'Básico',
    visualizacoes: 0,
    criadoEm: new Date().toISOString()
  };

  if (!dadosPost.titulo || !dadosPost.descricao) {
    throw new Error('Título e descrição são obrigatórios.');
  }

  const posts = obterPosts();
  posts.unshift(dadosPost);
  salvarPosts(posts);
  return dadosPost;
}

function canEditPost({ user, post }) {
  if (!user || !post) {
    return false;
  }

  const emailUser = normalizarEmail(user.email);
  const emailPost = normalizarEmail(post.email || post.usuarioEmail || post.autorEmail || '');

  if (emailPost && emailPost === emailUser) {
    return true;
  }

  if (post.usuarioId != null && user.id != null) {
    return String(post.usuarioId) === String(user.id);
  }

  return false;
}

function obterPosts() {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem('impulsoPosts') || '[]');
  } catch (erro) {
    return [];
  }
}

function salvarPosts(posts) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('impulsoPosts', JSON.stringify(posts));
  }
}

module.exports = { createPost, canEditPost, obterPosts, salvarPosts };
