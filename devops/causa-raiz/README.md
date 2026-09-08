---
nome: Causa-raiz
descricao: Cruza a configuração do cluster, métricas de JVM e logs nativos para diagnosticar incidentes complexos de performance e indisponibilidade no Cerebro.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: artefatos_incidente
    descricao: Pacote contendo o arquivo cerebro.yaml, métricas em formato tabular e trecho dos logs do Elasticsearch.
---

Cruza a configuração do cluster, métricas de JVM e logs nativos para diagnosticar incidentes complexos de performance e indisponibilidade no Cerebro.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/causa-raiz/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite. Gemini 3.1 Flash-Lite gera a análise; GPT-4o-mini atua como juiz, com calibração contra referência de IA documentada. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/causa-raiz.md).

O CI usa GPT-4.1 mini para gerar e julgar as análises, após erros 503 do Google e limitações do GPT-4o-mini. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Decomposição em evidências, causa provável, incertezas e ação. A primeira resposta sugeriu heap de 12GB sem base e confundiu aviso com disparo do circuit breaker, mas o juiz deu 7/8. Refinei para conferir a cronologia, evitar capacidade inventada e priorizar contenção reversível. A segunda resposta, do Gemini 3.1 Flash-Lite, recebeu 8/8 do GPT-4o-mini. Essas são as notas anteriores à calibração. Após confrontar as mesmas respostas com minha revisão como assistente de IA, refinei o juiz para verificar causalidade, cronologia e limites das evidências. O juiz final usa GPT-4.1 mini e cálculo determinístico do corte. A [calibração](../../evidencias/calibracao/) substituiu a etapa humana por orientação do responsável pela entrega, sem alterar a rubrica.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).
