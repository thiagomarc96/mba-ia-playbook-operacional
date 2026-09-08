---
nome: Etapas da migração
descricao: Recebe o diagnóstico do Elo 1 e desenha a estratégia de migração em passos incrementais (sem big-bang), garantindo reversibilidade.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: diagnostico_anterior
    descricao: Saída gerada pelo prompt de diagnóstico do Forge.
  - nome: cenario_original
    descricao: Cenário original com restrições e dependências do Forge.
---

Recebe o diagnóstico do Elo 1 e desenha a estratégia de migração em passos incrementais (sem big-bang), garantindo reversibilidade.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/etapas-da-migracao/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite. Gemini 3.1 Flash-Lite gera e julga neste teste. Isso reduz a diversidade da avaliação; a curadoria registra falhas que o juiz não detectou. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/etapas-da-migracao.md).

O CI usa GPT-4.1 mini para gerar e julgar as análises, após erros 503 do Google e limitações do GPT-4o-mini. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Segundo elo do prompt chaining: recebe a saída real do diagnóstico e o cenário original. A primeira resposta propôs dupla escrita em produção sem controle de duplicação. Refinei para validar em destinos separados e promover um único escritor ativo, preservando os contratos dos consumidores.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).

A execução da cadeia seguiu diagnóstico → etapas → plano, passando as saídas entre elos. Nos testes isolados, essas saídas reais ficam congeladas em `casos.yaml`. Para uma nova cadeia, substituir o parâmetro do próximo elo pela nova resposta anterior.

Decisões da curadoria: consumir continuamente em pequenos blocos, dimensionados por teste. Validar em tabelas separadas e consumidores de teste; não apontar consumidores de produção para shadow nesta fase. Os cortes de 3 ciclos e <10min por 7 dias são sugestões não aprovadas e devem ser definidos com o responsável antes de usar como aceite.
