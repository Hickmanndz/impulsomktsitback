function listarAvaliacoes(avaliacoes = []) {
  return avaliacoes;
}

function calcularMedia(avaliacoes = []) {
  if (!avaliacoes.length) {
    return 0;
  }

  const total = avaliacoes.reduce((soma, item) => soma + Number(item.nota || 0), 0);
  return total / avaliacoes.length;
}

module.exports = { listarAvaliacoes, calcularMedia };
