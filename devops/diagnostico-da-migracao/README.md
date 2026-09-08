---
nome: Diagnóstico da migração
descricao: Analisa o estado atual do pipeline Forge baseado em lote (batch) para identificar pontos de fragilidade e dependências críticas antes da migração para event-driven.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: estado_atual_forge
    descricao: Descrição detalhada da arquitetura atual do Forge, frequência de batch, tempo de processamento e sistemas dependentes.
---

Analisa o estado atual do pipeline Forge baseado em lote (batch) para identificar pontos de fragilidade e dependências críticas antes da migração para event-driven.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/diagnostico-da-migracao/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite. Gemini 3.1 Flash-Lite gera e julga neste teste. Isso reduz a diversidade da avaliação; a curadoria registra falhas que o juiz não detectou. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/diagnostico-da-migracao.md).

O CI usa GPT-4.1 mini para gerar e julgar as análises, após erros 503 do Google e limitações do GPT-4o-mini. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Primeiro elo do prompt chaining: identifica fatos, dependências e riscos antes de planejar. Refinei para separar espera pelo cron de tempo de processamento, identificar concorrência de escrita e evitar presumir contratos de consumidores.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).

A execução da cadeia seguiu diagnóstico → etapas → plano, passando as saídas entre elos. Nos testes isolados, essas saídas reais ficam congeladas em `casos.yaml`. Para uma nova cadeia, substituir o parâmetro do próximo elo pela nova resposta anterior.

Correção da curadoria: o cenário já informa que Sentinel lê tabelas agregadas; isso não é uma informação faltante. Preservar esse contrato durante a transição. A resposta original foi mantida para evidenciar a falha que o juiz não percebeu.
