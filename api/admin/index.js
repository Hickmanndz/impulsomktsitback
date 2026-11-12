function listarUsuarios(usuarios = []) {
  return usuarios;
}

function listarPosts(posts = []) {
  return posts;
}

function dashboardResumo({ usuarios = [], posts = [], pagamentos = [] }) {
  return {
    totalUsuarios: usuarios.length,
    totalPosts: posts.length,
    totalPagamentos: pagamentos.length
  };
}

module.exports = { listarUsuarios, listarPosts, dashboardResumo };
