# nota-de-triagem-openai-final

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — openai:gpt-4.1-mini

Resultado: reprovou.
Latência: 2076 ms. Custo estimado de geração: US$ 0.0003108.

Output:

```text
sistema/problema: sentinel-api com autoscaler no limite máximo de réplicas  
consequência: aumento da fila no Relay em 2k/min e alta CPU média de 88%  
causa provável: tenant stark-industries enviando volume 4x acima do baseline após onboarding de nova região  
ação proposta: verificar capacidade do autoscaler e ajustar limites de réplicas  
time: @relay-core e @sre
```

Erro: Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: reprovou; Expected output to contain "ALERTA:"

- contains: reprovou; Expected output to contain "IMPACTO:"

- contains: reprovou; Expected output to contain "HIPÓTESE INICIAL:"

- contains: reprovou; Expected output to contain "AÇÃO IMEDIATA:"

- contains: reprovou; Expected output to contain "ESCALAR PARA:"

- regex: reprovou; Expected output to match regex "ESCALAR PARA:.*@\w+"

- javascript: passou; Assertion passed

- regex: reprovou; Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- not-contains: passou; Assertion passed

Tokens registrados: geração 507; julgamento 0.
## Caso 2 — openai:gpt-4.1-mini

Resultado: reprovou.
Latência: 1046 ms. Custo estimado de geração: US$ 0.0002436.

Output:

```text
sistema/problema: Relay com taxa de rejeição de ingestão elevada; consequência: buffer saturado após deploy; causa provável: saturação do buffer após atualização; ação proposta: verificar saturação do buffer e ajustar ingestão; time: @relay-core
```

Erro: Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: reprovou; Expected output to contain "ALERTA:"

- contains: reprovou; Expected output to contain "IMPACTO:"

- contains: reprovou; Expected output to contain "HIPÓTESE INICIAL:"

- contains: reprovou; Expected output to contain "AÇÃO IMEDIATA:"

- contains: reprovou; Expected output to contain "ESCALAR PARA:"

- regex: reprovou; Expected output to match regex "ESCALAR PARA:.*@\w+"

- javascript: passou; Assertion passed

- regex: reprovou; Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- not-contains: passou; Assertion passed

Tokens registrados: geração 450; julgamento 0.
## Caso 3 — openai:gpt-4.1-mini

Resultado: reprovou.
Latência: 1689 ms. Custo estimado de geração: US$ 0.0002716.

Output:

```text
sistema/problema: Forge com consumer lag crescente no batch forge-batch-ingest  
consequência: atraso no processamento e início de lag no Sentinel  
causa provável: falha no job anterior causando atraso acumulado  
ação proposta: verificar status do job anterior e ajustar processamento do batch  
time: @data-platform e @sre
```

Erro: Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: reprovou; Expected output to contain "ALERTA:"

- contains: reprovou; Expected output to contain "IMPACTO:"

- contains: reprovou; Expected output to contain "HIPÓTESE INICIAL:"

- contains: reprovou; Expected output to contain "AÇÃO IMEDIATA:"

- contains: reprovou; Expected output to contain "ESCALAR PARA:"

- regex: reprovou; Expected output to match regex "ESCALAR PARA:.*@\w+"

- javascript: passou; Assertion passed

- regex: reprovou; Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- not-contains: passou; Assertion passed

Tokens registrados: geração 469; julgamento 0.
