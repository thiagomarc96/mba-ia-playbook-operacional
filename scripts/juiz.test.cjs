const {test} = require('node:test');
const assert = require('node:assert/strict');
const Juiz = require('./juiz.cjs');

async function avaliar(notas, texto = false) {
  const juiz = Object.create(Juiz.prototype);
  const resposta = {criterios: notas.map((nota, i) => ({criterio: String(i), nota, evidencia: 'Caso de teste'}))};
  juiz.provedor = Promise.resolve({callApi: async () => ({output: texto ? JSON.stringify(resposta) : resposta})});
  return JSON.parse((await juiz.callApi('')).output);
}

test('6/8 sem zero aprova mesmo no limite do corte', async () => {
  const r = await avaliar([2, 1, 1, 2]);
  assert.equal(r.pass, true);
  assert.equal(r.score, 0.75);
});
test('6/8 com zero reprova', async () => {
  assert.equal((await avaliar([2, 2, 2, 0])).pass, false);
});
test('5/8 reprova e aceita resposta JSON em texto', async () => {
  const r = await avaliar([2, 1, 1, 1], true);
  assert.equal(r.pass, false);
  assert.equal(r.score, 0.625);
});
test('notas fora da escala ou quantidade incorreta são erros', async () => {
  await assert.rejects(avaliar([2, 2, 2, 3]));
  await assert.rejects(avaliar([2, 2, 2]));
});
