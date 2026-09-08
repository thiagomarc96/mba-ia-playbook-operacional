# nota-de-triagem-v3

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 1812 ms. Custo estimado de geração: US$ 0.00029350000000000003.

Output:

```text
ALERTA: autoscaler atingiu limite de 60 réplicas no sentinel-api com CPU em 88%
IMPACTO: aumento na profundidade da fila do Relay em 2k/min para o tenant stark-industries
HIPÓTESE INICIAL: sobrecarga no sentinel-api devido ao volume de tráfego do tenant stark-industries
AÇÃO IMEDIATA: verificar logs de tráfego do tenant stark-industries e avaliar aumento de limite de réplicas
ESCALAR PARA: @sre se persistir
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

Tokens registrados: geração 574; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 2392 ms. Custo estimado de geração: US$ 0.00010634999999999998.

Output:

```text
ALERTA: autoscaler hit max replicas (60/60) on sentinel-api  
IMPACTO: queue depth on Relay growing 2k/min  
HIPÓTESE INICIAL: aumento de volume após onboarding de nova região  
AÇÃO IMEDIATA: verificar configuração do autoscaler e ajustar limites  
ESCALAR PARA: @sre se persistir
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

Tokens registrados: geração 496; julgamento 0.
## Caso 2 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 2427 ms. Custo estimado de geração: US$ 0.0002475.

Output:

```text
ALERTA: Relay ingest reject rate 6% para tenant wakanda-systems após deploy
IMPACTO: Rejeição de ingestão de dados para o tenant wakanda-systems
HIPÓTESE INICIAL: Saturação de buffer causada pelo deploy das 02:55
AÇÃO IMEDIATA: Verificar logs de erro do buffer e status do deploy recente
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

Tokens registrados: geração 525; julgamento 0.
## Caso 2 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1167 ms. Custo estimado de geração: US$ 0.00010815.

Output:

```text
ALERTA: ingest reject rate 6% for 8min, tenant wakanda-systems  
IMPACTO: efeito conhecido ou provável, sem inventar abrangência  
HIPÓTESE INICIAL: buffer saturado após deploy às 02:55  
AÇÃO IMEDIATA: verificar a configuração do buffer e ajustar se necessário  
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

Tokens registrados: geração 484; julgamento 0.
## Caso 3 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 3530 ms. Custo estimado de geração: US$ 0.000253.

Output:

```text
ALERTA: Forge consumer lag de 9 minutos no batch forge-batch-ingest com atraso no Sentinel
IMPACTO: Atraso no processamento de dados do Forge e reflexo no Sentinel
HIPÓTESE INICIAL: Falha no job anterior impedindo o processamento do batch atual
AÇÃO IMEDIATA: Verificar logs do job anterior e reiniciar o processamento do batch
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

Tokens registrados: geração 527; julgamento 0.
## Caso 3 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1721 ms. Custo estimado de geração: US$ 0.00010424999999999999.

Output:

```text
ALERTA: consumer lag 9min and climbing, batch forge-batch-ingest  
IMPACTO: downstream Sentinel starting to lag  
HIPÓTESE INICIAL: atraso no processamento devido a falha no trabalho anterior  
AÇÃO IMEDIATA: verificar a causa da falha no trabalho anterior  
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

Tokens registrados: geração 479; julgamento 0.
