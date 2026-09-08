# nota-de-triagem-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.5-flash-lite

Resultado: erro de API.
Latência: 54744 ms. Custo estimado de geração: US$ 0.

Output:

```text
(sem resposta)
```

Erro: Error: No candidates returned in API response.

Got response: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}

Tokens registrados: geração 469; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 2085 ms. Custo estimado de geração: US$ 0.00016395.

Output:

```text
ALERTA: Sentinel - autoscaler atingiu o máximo de réplicas (60/60) no sentinel-api  
IMPACTO: fila no Relay crescendo a 2k/min, afetando a capacidade de resposta  
HIPÓTESE INICIAL: aumento de volume de 4x após onboarding de nova região  
AÇÃO IMEDIATA: recomendar ajuste na configuração do autoscaler  
ESCALAR PARA: @sre se a situação não melhorar em 10min  
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

Tokens registrados: geração 808; julgamento 0.
## Caso 2 — google:gemini-3.5-flash-lite

Resultado: erro de API.
Latência: 22985 ms. Custo estimado de geração: US$ 0.

Output:

```text
(sem resposta)
```

Erro: Error: No candidates returned in API response.

Got response: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}

Tokens registrados: geração 808; julgamento 0.
## Caso 2 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1111 ms. Custo estimado de geração: US$ 0.00015554999999999999.

Output:

```text
ALERTA: Relay - taxa de rejeição de ingestão acima de 6% por 8min  
IMPACTO: ingestão de telemetry degradada para ~6% do tenant wakanda-systems  
HIPÓTESE INICIAL: buffer saturado após deploy às 02:55  
AÇÃO IMEDIATA: recomendar  
ESCALAR PARA: @relay-core se a rejeição não cair em 10min  
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

Tokens registrados: geração 779; julgamento 0.
## Caso 3 — google:gemini-3.5-flash-lite

Resultado: erro de API.
Latência: 65259 ms. Custo estimado de geração: US$ 0.

Output:

```text
(sem resposta)
```

Erro: Error: No candidates returned in API response.

Got response: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}

Tokens registrados: geração 779; julgamento 0.
## Caso 3 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1729 ms. Custo estimado de geração: US$ 0.00015525.

Output:

```text
ALERTA: Forge - consumer lag de 9min e aumentando  
IMPACTO: downstream Sentinel começando a apresentar latência  
HIPÓTESE INICIAL: falha no job anterior causou atraso no batch forge-batch-ingest  
AÇÃO IMEDIATA: investigar falha do job anterior e reiniciar o batch  
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

Tokens registrados: geração 780; julgamento 0.
