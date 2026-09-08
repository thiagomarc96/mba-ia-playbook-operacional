---
nome: Decisão de backpressure
descricao: Compara alternativas arquiteturais de backpressure e mitigação de sobrecarga no barramento Relay, pesando SLAs, custos e restrições.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: cenario_relay
    descricao: Dados de throughput, picos, retenção, dependências e restrições orçamentárias e de SLA do Relay.
---

Compara alternativas arquiteturais de backpressure e mitigação de sobrecarga no barramento Relay, pesando SLAs, custos e restrições.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/decisao-de-backpressure/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite. Gemini 3.1 Flash-Lite gera e julga neste teste. Isso reduz a diversidade da avaliação; a curadoria registra falhas que o juiz não detectou. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/decisao-de-backpressure.md).

O CI usa GPT-4.1 mini para gerar e julgar as análises, após erros 503 do Google e limitações do GPT-4o-mini. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Comparação de alternativas com restrições explícitas. A primeira resposta calculou 210 milhões de mensagens excedentes, mas inventou margem de drenagem e prometeu SLAs. Refinei para usar a taxa posterior como variável, separar retenção de atraso e condicionar a recomendação à validação de capacidade. O juiz agora trata garantias sem capacidade demonstrada como falha no critério de restrições.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).

Ressalva da revisão: a expressão "protege o SLA" na resposta ainda é categórica demais. Priorizar Sentinel é a proposta; cumprir 60s depende de capacidade reservada suficiente, a medir. A recomendação não é garantia de SLA nem de ausência de perda.
