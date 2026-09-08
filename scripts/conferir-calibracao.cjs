const fs = require('node:fs');
const pasta = 'evidencias/calibracao/';
if (!fs.existsSync(pasta + 'notas-referencia.json')) {
  throw new Error('Falta a pontuação de referência das amostras A e B para calibrar o juiz.');
}
const referencias = JSON.parse(fs.readFileSync(pasta + 'notas-referencia.json'));
const juiz = JSON.parse(fs.readFileSync(pasta + 'notas-juiz.json'));
const criterios = ['Causa-raiz correta', 'Correlação × causa', 'Ação proporcional', 'Honestidade epistêmica'];
for (const amostra of ['A', 'B']) {
  if (!Array.isArray(referencias[amostra]) || referencias[amostra].length !== 4) {
    throw new Error(`São necessárias quatro notas de referência para ${amostra}.`);
  }
  criterios.forEach((criterio, i) => {
    const referencia = referencias[amostra][i];
    const automatica = juiz[amostra]?.[criterio]?.nota;
    if (![0, 1, 2].includes(referencia) || ![0, 1, 2].includes(automatica) ||
        Math.abs(referencia - automatica) > 1) {
      throw new Error(`Calibração reprovada: ${amostra}, ${criterio}.`);
    }
  });
}
console.log('Calibração conferida: diferença de no máximo 1 ponto por critério.');
