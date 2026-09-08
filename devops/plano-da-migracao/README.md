---
nome: Plano da migração
descricao: Recebe as etapas do Elo 2 e detalha o plano técnico de execução e mitigação de riscos para cada fase da transição do Forge.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: etapas_anteriores
    descricao: Saída gerada pelo prompt de planejamento de etapas da migração.
  - nome: cenario_original
    descricao: Cenário original com restrições e dependências do Forge.
---

Recebe as etapas do Elo 2 e detalha o plano técnico de execução e mitigação de riscos para cada fase da transição do Forge.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/plano-da-migracao/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite. Gemini 3.1 Flash-Lite gera e julga neste teste. Isso reduz a diversidade da avaliação; a curadoria registra falhas que o juiz não detectou. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/plano-da-migracao.md).

O CI usa GPT-4.1 mini para gerar e julgar as análises, após erros 503 do Google e limitações do GPT-4o-mini. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Terceiro elo do prompt chaining: recebe as etapas reais e o cenário original. Refinei para interromper o escritor novo antes de reativar o lote, reconciliar a janela e fazer replay de um checkpoint seguro. Idempotência exige chave estável com unicidade ou operação atômica, não apenas consultar antes de inserir.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).

A execução da cadeia seguiu diagnóstico → etapas → plano, passando as saídas entre elos. Nos testes isolados, essas saídas reais ficam congeladas em `casos.yaml`. Para uma nova cadeia, substituir o parâmetro do próximo elo pela nova resposta anterior.

Solução final curada: consumir o Relay continuamente em pequenos blocos; validar resultados em ambiente de teste e tabelas shadow separadas; manter Sentinel lendo tabelas agregadas e preservar os contratos de Cerebro/billing; promover por escopo com um único escritor ativo. Em rollback, parar o novo escritor, reconciliar o intervalo, executar replay do checkpoint seguro e só então devolver o destino ao lote. Os cortes numéricos da resposta são propostas a validar; não autorizam avanço automático. A fase de leitura shadow pertence ao ambiente de teste.
