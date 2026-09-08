---
nome: Triagem de pods
descricao: Realiza triagem rápida e confiável da saúde dos pods em um cluster Kubernetes a partir de um snapshot contendo lista de pods, eventos do describe e logs anteriores.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: snapshot_cluster
    descricao: Texto contendo a saída de kubectl get pods, kubectl describe pod e kubectl logs para os pods analisados.
---

Realiza triagem rápida e confiável da saúde dos pods em um cluster Kubernetes a partir de um snapshot contendo lista de pods, eventos do describe e logs anteriores.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/triagem-de-pods/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite, openai:gpt-4o-mini. Flash-Lite foi escolhido pelo custo e pela cota; GPT-4o-mini permite comparar outro fornecedor com baixo custo. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/triagem-de-pods.md).

O CI usa GPT-4o-mini após os erros 503 do Google. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Role prompting e formato explícito. O prompt cruza status, eventos e logs, e não trata um reinício antigo isolado como falha atual. Os seis diagnósticos atenderam ao conteúdo; uma chamada Google reprovou por 20,6s, acima do limite de 5s. Não alterei o limite nem a entrada para aprovar.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).
