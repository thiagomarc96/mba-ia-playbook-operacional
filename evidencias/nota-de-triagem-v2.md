# nota-de-triagem-v2

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: erro de API.
Latência: 33475 ms. Custo estimado de geração: US$ 0.

Output:

```text
(sem resposta)
```

Erro: Error: No candidates returned in API response.

Got response: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}

Tokens registrados: geração 780; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1494 ms. Custo estimado de geração: US$ 0.00017445.

Output:

```text
ALERTA: Sentinel - autoscaler atingiu o máximo de réplicas no sentinel-api  
IMPACTO: capacidade de atendimento degradada para o tenant stark-industries  
HIPÓTESE INICIAL: onboarding de nova região gerou aumento no volume de eventos  
AÇÃO IMEDIATA: recomendar aumento do limite de réplicas do autoscaler  
ESCALAR PARA: @sre se o problema persistir  
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- javascript: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 911; julgamento 0.
## Caso 2 — openai:gpt-4o-mini

Resultado: reprovou.
Latência: 1770 ms. Custo estimado de geração: US$ 0.00016964999999999998.

Output:

```text
ALERTA: Relay - taxa de rejeição de ingestão de 6% por 8min  
IMPACTO: ingestão de telemetry degradada para ~6% dos tenants  
HIPÓTESE INICIAL: buffer saturado após deploy às 02:55  
AÇÃO IMEDIATA: recomendar  
ESCALAR PARA: @relay-core se a rejeição não cair em 10min  
```

Erro: Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- javascript: passou; Assertion passed

- regex: reprovou; Expected output to match regex "AÇÃO IMEDIATA:\s*\S.{15,}"

Tokens registrados: geração 888; julgamento 0.
## Caso 2 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 983 ms. Custo estimado de geração: US$ 0.00035875.

Output:

```text
ALERTA: Relay - taxa de rejeição de ingestão de 6% por 8min
IMPACTO: ingestão de telemetry degradada para o tenant wakanda-systems
HIPÓTESE INICIAL: deploy do Relay às 02:55 saturou o buffer de ingestão
AÇÃO IMEDIATA: recomendar rollback do deploy realizado às 02:55
ESCALAR PARA: @relay-core se persistir
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- javascript: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 955; julgamento 0.
## Caso 3 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 2142 ms. Custo estimado de geração: US$ 0.00034925.

Output:

```text
ALERTA: Forge - consumer lag de 9min em crescimento no batch forge-batch-ingest
IMPACTO: atraso no processamento de dados e lag no Sentinel
HIPÓTESE INICIAL: falha no job anterior impedindo o processamento do batch atual
AÇÃO IMEDIATA: recomendar reinicialização do job de ingestão falho
ESCALAR PARA: @data-platform se persistir
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- javascript: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 947; julgamento 0.
## Caso 3 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1428 ms. Custo estimado de geração: US$ 0.00017235.

Output:

```text
ALERTA: Forge - consumer lag de 9min e aumentando  
IMPACTO: ingestão de dados atrasada para todos os tenants  
HIPÓTESE INICIAL: falha no job anterior causou atraso no processamento  
AÇÃO IMEDIATA: reiniciar o job de ingestão do batch forge-batch-ingest  
ESCALAR PARA: @data-platform se o lag não estabilizar em 10min  
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- javascript: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 894; julgamento 0.
