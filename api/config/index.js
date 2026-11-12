const STORAGE_KEYS = {
  usuarios: 'impulsoUsuarios',
  posts: 'impulsoPosts',
  usuarioLogado: 'impulsoUsuarioLogado',
  pagamentos: 'impulsoPagamentos'
};

const appConfig = {
  storageKeys: STORAGE_KEYS,
  planoPadrao: 'Básico',
  planos: {
    Básico: {
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
      limitePosts: 50,
      destaque: true,
      prioridade: true,
      selo: true,
      premium: true,
      descricao: 'Acesso completo com destaque premium.'
    }
  }
};

module.exports = { appConfig, STORAGE_KEYS };
