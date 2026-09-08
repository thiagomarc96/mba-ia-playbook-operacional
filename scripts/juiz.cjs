const {loadApiProvider} = require('promptfoo');

module.exports = class Juiz {
  constructor() {
    this.provedor = loadApiProvider('openai:gpt-4.1-mini', {options: {config: {
      temperature: 0,
      max_tokens: 2400,
      response_format: {type: 'json_schema', json_schema: {name: 'avaliacao', strict: true, schema: {
        type: 'object', additionalProperties: false, required: ['criterios'],
        properties: {criterios: {type: 'array', items: {
          type: 'object', additionalProperties: false, required: ['criterio', 'nota', 'evidencia'],
          properties: {criterio: {type: 'string'}, nota: {type: 'integer', enum: [0, 1, 2]}, evidencia: {type: 'string'}}
        }}}
      }}}
    }}});
  }
  id() { return 'juiz:gpt-4.1-mini'; }
  async callApi(prompt, contexto, opcoes) {
    const resposta = await (await this.provedor).callApi(prompt, contexto, opcoes);
    if (resposta.error || !resposta.output) return resposta;
    const {criterios} = typeof resposta.output === 'string' ? JSON.parse(resposta.output) : resposta.output;
    if (!Array.isArray(criterios) || criterios.length !== 4 ||
        criterios.some(c => ![0, 1, 2].includes(c.nota))) {
      throw new Error('O juiz deve fornecer exatamente quatro notas de 0 a 2.');
    }
    // A IA atribui notas; o código aplica o corte sem depender da aritmética do modelo.
    const total = criterios.reduce((soma, c) => soma + c.nota, 0);
    return {...resposta, output: JSON.stringify({
      reason: {criterios, total},
      score: total / 8,
      pass: total >= 6 && criterios.every(c => c.nota > 0)
    })};
  }
};
