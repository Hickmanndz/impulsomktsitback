const { normalizarEmail, gerarId } = require('../helpers');

function registrarPagamento({ user, plano, valor, metodo, status = 'pendente', detalhes = {} }) {
  if (!user || !user.email || !plano) {
    throw new Error('Usuário e plano são obrigatórios para registrar o pagamento.');
  }

  const pagamentos = obterPagamentos();
  const pagamento = {
    id: gerarId(),
    usuarioId: user.id || null,
    usuarioEmail: normalizarEmail(user.email),
    usuarioNome: user.nome || 'Usuário',
    plano: String(plano),
    valor: Number(valor || 0),
    metodo: String(metodo || 'pix'),
    status: String(status).toLowerCase(),
    detalhes: detalhes || {},
    criadoEm: new Date().toISOString(),
    confirmadoEm: null,
    planoValidoAte: null
  };

  pagamentos.unshift(pagamento);
  salvarPagamentos(pagamentos);
  return pagamento;
}

function confirmarPagamentoPix({ user, pagamentoId }) {
  if (!user || !pagamentoId) {
    return null;
  }

  const pagamentos = obterPagamentos();
  const pagamento = pagamentos.find((item) => item.id === pagamentoId);

  if (!pagamento) {
    return null;
  }

  if (normalizarEmail(pagamento.usuarioEmail) !== normalizarEmail(user.email)) {
    return null;
  }

  pagamento.status = 'confirmado';
  pagamento.confirmadoEm = new Date().toISOString();
  pagamento.planoValidoAte = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const usuarios = JSON.parse(localStorage.getItem('impulsoUsuarios') || '[]');
  const indiceUsuario = usuarios.findIndex((item) => String(item.id) === String(user.id));

  if (indiceUsuario >= 0) {
    usuarios[indiceUsuario].plano = pagamento.plano;
    usuarios[indiceUsuario].planoInicio = new Date().toISOString();
    usuarios[indiceUsuario].planoValidoAte = pagamento.planoValidoAte;
    localStorage.setItem('impulsoUsuarios', JSON.stringify(usuarios));
  }

  salvarPagamentos(pagamentos);
  return pagamento;
}

function podeAutorizarCompra({ user, pagamento }) {
  if (!user || !pagamento) {
    return false;
  }

  return (
    normalizarEmail(user.email) === normalizarEmail(pagamento.usuarioEmail || '') &&
    String(pagamento.status || '').toLowerCase() === 'confirmado'
  );
}

function obterPagamentos() {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem('impulsoPagamentos') || '[]');
  } catch (erro) {
    return [];
  }
}

function salvarPagamentos(pagamentos) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('impulsoPagamentos', JSON.stringify(pagamentos));
  }
}

module.exports = {
  registrarPagamento,
  confirmarPagamentoPix,
  podeAutorizarCompra,
  obterPagamentos,
  salvarPagamentos
};
