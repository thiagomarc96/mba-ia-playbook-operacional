const fs = require('node:fs');
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const [pasta, base] = process.argv.slice(2);
const atual = JSON.parse(fs.readFileSync('resultados/atual.json'));
const linhasAtuais = atual.results.results;
if (!linhasAtuais?.length || linhasAtuais.some(r => !r.success)) {
  throw new Error('A versão atual tem falha de teste ou erro de API.');
}
if (!base || /^0+$/.test(base)) {
  console.log('Primeiro push: versão atual aprovada, sem base anterior.');
  process.exit(0);
}
if (!/^[a-f0-9]{40}$/i.test(base)) {
  throw new Error('SHA da versão anterior inválido.');
}
const consultarBase = () => spawnSync('git', ['cat-file', '-e', `${base}^{commit}`]);
if (consultarBase().status !== 0) {
  // Um amend pode deixar o commit anterior fora do histórico baixado pelo checkout.
  const busca = spawnSync('git', ['fetch', '--no-tags', '--depth=1', 'origin', base], {stdio: 'inherit'});
  if (busca.status !== 0 || consultarBase().status !== 0) {
    throw new Error('Não foi possível recuperar o commit anterior para comparar.');
  }
}
const arquivo = `${pasta}/prompt.md`;
const anterior = spawnSync('git', ['show', `${base}:${arquivo}`], {encoding: 'utf8'});
if (anterior.status !== 0) {
  const existeBase = spawnSync('git', ['cat-file', '-e', `${base}^{commit}`]);
  if (existeBase.status !== 0) throw new Error('Commit-base indisponível.');
  console.log('Prompt novo: versão atual aprovada, sem versão anterior deste prompt.');
  process.exit(0);
}
if (anterior.stdout === fs.readFileSync(arquivo, 'utf8')) {
  console.log('Prompt preservado: testes atuais aprovados; sem repetir a mesma geração.');
  process.exit(0);
}
const temporario = path.resolve(pasta, '.prompt-anterior.md');
fs.writeFileSync(temporario, anterior.stdout);
try {
  // A base usa o mesmo conjunto atual de casos e critérios, para a comparação ser equivalente.
  const resultado = spawnSync('npx', ['--no-install', 'promptfoo', 'eval', '-c',
    `${pasta}/promptfooconfig.yaml`, '--prompts', temporario, '--no-cache',
    '--no-share', '--max-concurrency', '1', '--output', 'resultados/anterior.json'], {stdio: 'inherit'});
  if (![0, 100].includes(resultado.status)) throw new Error('Falha ao avaliar a versão anterior.');
  const antes = JSON.parse(fs.readFileSync('resultados/anterior.json')).results.results;
  if (antes.length !== linhasAtuais.length) throw new Error('Quantidade de casos incompatível.');
  const chave = r => `${r.testIdx}/${r.provider.id}`;
  const indice = new Map(antes.map(r => [chave(r), r]));
  for (const depois of linhasAtuais) {
    const antes = indice.get(chave(depois));
    if (!antes || antes.failureReason === 2 || !antes.response?.output || antes.response?.error) throw new Error('Base sem resposta válida comparável.');
    const notas = r => r.gradingResult.componentResults
      .filter(c => c.assertion?.type === 'llm-rubric').map(c => c.score);
    const notasAntes = notas(antes);
    const notasDepois = notas(depois);
    if (notasAntes.length !== notasDepois.length ||
      notasDepois.some((n, i) => !Number.isFinite(n) || n < notasAntes[i])) {
      throw new Error(`Regressão de qualidade no caso ${chave(depois)}.`);
    }
  }
  console.log('Sem queda de qualidade nos casos comparados.');
} finally {
  fs.unlinkSync(temporario);
}
