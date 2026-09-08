# nota-de-triagem

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 1452 ms. Custo estimado de geração: US$ 0.00031525.

Output:

```text
ALERTA: Sentinel atingiu o limite máximo de 60 réplicas no serviço sentinel-api.
IMPACTO: Aumento na profundidade da fila do Relay em 2k/min e CPU média em 88% para o tenant stark-industries.
HIPÓTESE INICIAL: Sobrecarga no processamento devido ao volume de tráfego 4x superior à linha de base após onboarding de nova região.
AÇÃO IMEDIATA: Aumentar temporariamente o limite de réplicas do autoscaler para o serviço sentinel-api.
ESCALAR PARA: @sre
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

- not-contains: passou; Assertion passed

Tokens registrados: geração 606; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1576 ms. Custo estimado de geração: US$ 0.0001401.

Output:

```text
ALERTA: O sistema Sentinel atingiu o número máximo de réplicas (60/60) na API do Sentinel.  
IMPACTO: A profundidade da fila no Relay está crescendo a uma taxa de 2k por minuto, indicando possível atraso no processamento.  
HIPÓTESE INICIAL: O aumento no volume de eventos, quatro vezes o volume base, pode estar relacionado à integração de uma nova região pelo tenant stark-industries.  
AÇÃO IMEDIATA: Verificar a configuração do autoscaler e a capacidade de processamento do Relay.  
ESCALAR PARA: @sre.
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

- not-contains: passou; Assertion passed

Tokens registrados: geração 571; julgamento 0.
## Caso 2 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 1484 ms. Custo estimado de geração: US$ 0.00027075.

Output:

```text
ALERTA: Sistema Relay apresentando taxa de rejeição de ingestão de 6% para o tenant wakanda-systems.
IMPACTO: Rejeição de eventos de ingestão para o tenant wakanda-systems.
HIPÓTESE INICIAL: Saturação do buffer decorrente do deploy realizado às 02:55.
AÇÃO IMEDIATA: Verificar métricas de saturação do buffer e logs do deploy recente.
ESCALAR PARA: @relay-core
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

- not-contains: passou; Assertion passed

Tokens registrados: geração 558; julgamento 0.
## Caso 2 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1584 ms. Custo estimado de geração: US$ 0.00013049999999999997.

Output:

```text
ALERTA: Sistema Relay apresenta uma taxa de rejeição de ingestão de 6% por 8 minutos, afetando o tenant wakanda-systems.  
IMPACTO: O efeito conhecido é a perda de dados durante o período de rejeição.  
HIPÓTESE INICIAL: A saturação do buffer após o deploy às 02:55 pode ter causado a rejeição dos eventos.  
AÇÃO IMEDIATA: Verificar o estado do buffer e a configuração do deploy realizado.  
ESCALAR PARA: @relay-core.
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

- not-contains: passou; Assertion passed

Tokens registrados: geração 540; julgamento 0.
## Caso 3 — google:gemini-3.1-flash-lite

Resultado: reprovou.
Latência: 47800 ms. Custo estimado de geração: US$ 0.00026425.

Output:

```text
ALERTA: Sistema Forge com atraso de consumo de 9 minutos no batch forge-batch-ingest.
IMPACTO: Atraso no processamento de dados e início de latência no sistema Sentinel.
HIPÓTESE INICIAL: Falha no job anterior impedindo o processamento da fila atual.
AÇÃO IMEDIATA: Reiniciar o job de ingestão do batch forge-batch-ingest.
ESCALAR PARA: @data-platform
```

Erro: Latency 47800ms is greater than threshold 5000ms

- latency: reprovou; Latency 47800ms is greater than threshold 5000ms

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- javascript: passou; Assertion passed

- regex: passou; Assertion passed

- not-contains: passou; Assertion passed

Tokens registrados: geração 552; julgamento 0.
## Caso 3 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1733 ms. Custo estimado de geração: US$ 0.000132.

Output:

```text
ALERTA: O sistema Forge está apresentando um atraso no consumidor de 9 minutos e aumentando, relacionado ao lote forge-batch-ingest.  
IMPACTO: O efeito conhecido é que o Sentinel downstream está começando a apresentar atraso.  
HIPÓTESE INICIAL: A explicação provável é que o atraso no consumidor é resultado de uma falha no trabalho anterior.  
AÇÃO IMEDIATA: Verificar o status do lote forge-batch-ingest e identificar a causa da falha anterior.  
ESCALAR PARA: @sre.
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

- not-contains: passou; Assertion passed

Tokens registrados: geração 544; julgamento 0.
