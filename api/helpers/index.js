function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function gerarId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

module.exports = { normalizarEmail, gerarId };
