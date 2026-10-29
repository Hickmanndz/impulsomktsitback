const assert = require('assert');

const store = {};

global.localStorage = {
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
  },
  setItem(key, value) {
    store[key] = String(value);
  },
  removeItem(key) {
    delete store[key];
  },
  clear() {
    Object.keys(store).forEach((key) => delete store[key]);
  }
};

const { ImpulsoStorage } = require('./sistema-armazenamento.js');

const usuario1 = ImpulsoStorage.registerUser({
  nome: 'Ana',
  email: 'ana@email.com',
  senha: '123456'
});

const usuario2 = ImpulsoStorage.registerUser({
  nome: 'Bruno',
  email: 'bruno@email.com',
  senha: 'abcdef'
});

const post = ImpulsoStorage.createPost({
  user: usuario1,
  post: {
    titulo: 'Reforma de parede',
    descricao: 'Pintura e acabamento.',
    categoria: 'Construção',
    contato: '47999999999'
  }
});

assert.ok(post && post.id, 'o post deve ser criado');
assert.strictEqual(ImpulsoStorage.canEditPost({ user: usuario1, post }), true, 'o dono do post pode editar');
assert.strictEqual(ImpulsoStorage.canEditPost({ user: usuario2, post }), false, 'outro usuário não pode editar');
assert.strictEqual(ImpulsoStorage.getPosts().length, 1, 'os posts devem ficar salvos');
assert.strictEqual(ImpulsoStorage.getPosts()[0].email, usuario1.email, 'o post deve guardar o e-mail do dono');

const pagamentoPendente = ImpulsoStorage.registrarPagamento({
  user: usuario1,
  plano: 'Premium',
  valor: 40,
  metodo: 'pix',
  status: 'pendente'
});

assert.strictEqual(ImpulsoStorage.podeAutorizarCompra({ user: usuario1, pagamento: pagamentoPendente }), false, 'pagamento pendente não autoriza compra');

const confirmacao = ImpulsoStorage.confirmarPagamentoPix({ user: usuario1, pagamentoId: pagamentoPendente.id });
assert.strictEqual(confirmacao.status, 'confirmado', 'pagamento por pix precisa ser confirmado');
assert.ok(confirmacao.planoValidoAte, 'deve existir data de expiração do plano');
assert.strictEqual(ImpulsoStorage.podeAutorizarCompra({ user: usuario1, pagamento: confirmacao }), true, 'pagamento confirmado autoriza a compra');

console.log('storage ok');
