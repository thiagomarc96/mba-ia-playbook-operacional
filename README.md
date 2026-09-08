# Playbook de IA operacional

Trabalho do MBA para analisar os cenários da Aegis com prompts parametrizáveis, testes promptfoo e GitHub Actions.

Os oito prompts foram executados localmente. O juiz foi calibrado contra uma referência de IA, substituindo a avaliação humana por orientação do responsável pela entrega. O [pipeline no GitHub Actions](https://github.com/thiagomarc96/mba-ia-playbook-operacional/actions/workflows/avaliar.yml) executa a suíte em push e pull request. A rodada local de referência teve 17 aprovações e duas reprovações por latência (pods e notas), sem reduzir o limite do enunciado.

Use Node.js 24, uma chave Google e uma chave OpenAI:

```bash
npm ci
npm test
cp .env.example .env
npx promptfoo eval -c devops/nota-de-triagem/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Não sobrescreva um `.env` existente. Execute as outras configurações da mesma forma. Para uma nova execução encadeada do Forge, passe a resposta de cada elo ao parâmetro do seguinte. Os casos de teste contêm as saídas reais da execução documentada.

A biblioteca usa meta-prompting, papéis, instruções de formato, comparação de alternativas, encadeamento e verificação/refino. O few-shot inicial das notas foi substituído após contaminar respostas com fatos dos exemplos. Gemini 3.5 Flash-Lite criou os prompts; Gemini 3.1 Flash-Lite e GPT-4o-mini foram usados nas avaliações locais. No CI, uso GPT-4o-mini nas saídas estruturadas, Gemini 3.5 Flash-Lite na comparação das notas e GPT-4.1 mini nas análises abertas e no julgamento. [Modelos, custo e privacidade](privacidade.md).

Prompts e evidências:

- [Triagem de pods](devops/triagem-de-pods/): CP01 e CP08.
- [Nota de triagem](devops/nota-de-triagem/): CP02 e CP08.
- [Causa-raiz](devops/causa-raiz/): CP03 e CP09.
- [Decisão de backpressure](devops/decisao-de-backpressure/): CP04.
- [Diagnóstico](devops/diagnostico-da-migracao/), [etapas](devops/etapas-da-migracao/) e [plano](devops/plano-da-migracao/): cadeia do CP05.
- [NetworkPolicy](devops/networkpolicy-sentinel/): CP06 e CP08.
- [Pipeline e decisões comparadas](pipeline.md): CP10.

Base: [prompt-registry](https://github.com/fabricioveronez/prompt-registry), commit e32d6791b1d1edfe55ed8cea23cdbbd35f184a4e. Para o CP07, os oito prompts ficam em devops, cada um com prompt.md, README.md, inputs equivalentes aos placeholders e versão inicial 1.0.0. O CP05 ocupa três pastas porque exige uma cadeia. O histórico original e as categorias vazias foram preservados. A [triagem de pods](devops/triagem-de-pods/) é um exemplo completo do formato.

Categorias herdadas: [desenvolvimento](desenvolvimento/README.md), [produtividade](produtividade/README.md), [finanças](financas/README.md) e [criação de conteúdo](criacao-conteudo/README.md).
