const fs = require('fs');

const source = fs.readFileSync('./01.js', 'utf8');

if (!source.includes('input[name="metodoPagamento"]')) {
  throw new Error('O script de pagamento ainda não controla os métodos de pagamento.');
}

if (!source.includes('pagamentoCartao') || !source.includes('pagamentoPix')) {
  throw new Error('A troca entre Pix e cartão não foi implementada.');
}

console.log('Teste de pagamento OK.');
