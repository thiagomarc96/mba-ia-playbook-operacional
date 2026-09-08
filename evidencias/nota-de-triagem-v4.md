# nota-de-triagem-v4

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — openai:gpt-4o-mini

Resultado: reprovou.
Latência: 1214 ms. Custo estimado de geração: US$ 0.00010155.

Output:

```text
sistema/problema: sentinel-api com limite máximo de réplicas atingido  
consequência: aumento na profundidade da fila no Relay  
causa provável: envio de volume 4x maior após onboarding de nova região  
ação proposta: verificar configuração do autoscaler e ajustar limites  
time: @sre
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

Tokens registrados: geração 482; julgamento 0.
## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 1125 ms. Custo estimado de geração: US$ 0.0002525.

Output:

```text
ALERTA: Sentinel-api atingiu limite de réplicas e fila do Relay em crescimento
IMPACTO: Aumento na profundidade da fila do Relay e alta utilização de CPU
HIPÓTESE INICIAL: Volume de tráfego acima da média do tenant stark-industries
AÇÃO IMEDIATA: Verificar capacidade de processamento e ajustar limites do autoscaler
ESCALAR PARA: @sre e @relay-core
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

Tokens registrados: geração 545; julgamento 0.
## Caso 2 — openai:gpt-4o-mini

Resultado: reprovou.
Latência: 1004 ms. Custo estimado de geração: US$ 9.375e-05.

Output:

```text
sistema/problema: Relay  
consequência: taxa de rejeição de ingestão de 6% por 8 minutos  
causa provável: buffer saturado após deploy  
ação proposta: verificar a configuração do buffer e ajustar se necessário  
time: @relay-core  
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

Tokens registrados: geração 454; julgamento 0.
## Caso 2 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 1915 ms. Custo estimado de geração: US$ 0.00023799999999999998.

Output:

```text
ALERTA: Relay ingest reject rate 6% para tenant wakanda-systems
IMPACTO: Rejeição de ingestão de dados para o tenant wakanda-systems
HIPÓTESE INICIAL: Saturação de buffer após deploy realizado às 02:55
AÇÃO IMEDIATA: Verificar logs de buffer e reverter o deploy recente
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

Tokens registrados: geração 517; julgamento 0.
## Caso 3 — openai:gpt-4o-mini

Resultado: reprovou.
Latência: 2020 ms. Custo estimado de geração: US$ 9.465e-05.

Output:

```text
sistema/problema: Forge com atraso no consumidor de 9 minutos  
consequência: Atraso crescente no processamento de dados  
causa provável: Falha no trabalho anterior  
ação proposta: Verificar a causa da falha no trabalho anterior  
time: @data-platform
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

Tokens registrados: geração 457; julgamento 0.
## Caso 3 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 1394 ms. Custo estimado de geração: US$ 0.000221.

Output:

```text
ALERTA: Forge consumer lag em forge-batch-ingest
IMPACTO: Atraso no processamento de lotes e latência no Sentinel
HIPÓTESE INICIAL: Falha em job anterior não recuperada
AÇÃO IMEDIATA: Verificar logs do job anterior e reiniciar o processamento
ESCALAR PARA: @data-platform
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

Tokens registrados: geração 504; julgamento 0.
