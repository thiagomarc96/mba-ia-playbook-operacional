# triagem-de-pods

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: reprovou.
Latência: 20609 ms. Custo estimado de geração: US$ 0.00042275.

Output:

```text
POD: sentinel-api-7d9c8b6f4-h4m2t | CAUSA PROVÁVEL: OOMKilled (Exit Code 137) devido ao esgotamento do limite de memória (512Mi). Os logs confirmam que o processo atingiu 498Mi/512Mi durante o carregamento do cache de alertas, disparando um erro fatal de memória. | PRÓXIMA AÇÃO: Analisar o consumo de memória do cache ou aumentar o limite de memória (memory limit) do container no Deployment, caso o uso de 512Mi seja insuficiente para a carga atual.
```

Erro: Latency 20609ms is greater than threshold 5000ms

- latency: reprovou; Latency 20609ms is greater than threshold 5000ms

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 996; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1172 ms. Custo estimado de geração: US$ 0.00016409999999999998.

Output:

```text
POD: sentinel-api-7d9c8b6f4-h4m2t | CAUSA PROVÁVEL: OOMKilled devido a alta pressão de GC e uso de memória próximo ao limite (498Mi/512Mi) | PRÓXIMA AÇÃO: Aumentar os limites de memória do pod para evitar OOMKilled.
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 872; julgamento 0.
## Caso 2 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 2332 ms. Custo estimado de geração: US$ 0.00048724999999999994.

Output:

```text
POD: sentinel-api-7d9c8b6f4-zzp10 | CAUSA PROVÁVEL: Falha ao puxar a imagem (ImagePullBackOff) devido a "manifest unknown", indicando que a tag 2.9.2 não existe no registro registry.aegis.io. | PRÓXIMA AÇÃO: Verificar se a tag 2.9.2 foi publicada corretamente no registro ou corrigir a versão da imagem no Deployment.

POD: sentinel-ingest-8f7a9c5b-4dkqm | CAUSA PROVÁVEL: Falha de agendamento (Pending) por falta de recursos (Insufficient cpu), pois o cluster não possui nós com capacidade disponível para atender à requisição de 2 CPUs. | PRÓXIMA AÇÃO: Verificar a capacidade atual do cluster ou ajustar o limite de requests de CPU no manifesto do pod.
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 984; julgamento 0.
## Caso 2 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1963 ms. Custo estimado de geração: US$ 0.00021089999999999998.

Output:

```text
POD: sentinel-api-7d9c8b6f4-zzp10 | CAUSA PROVÁVEL: Falha ao puxar a imagem "registry.aegis.io/sentinel-api:2.9.2" devido a "manifest unknown" | PRÓXIMA AÇÃO: Verificar se a imagem existe no registro e se o nome e a tag estão corretos.

POD: sentinel-ingest-8f7a9c5b-4dkqm | CAUSA PROVÁVEL: Falha de agendamento devido à insuficiência de recursos de CPU disponíveis nos nós | PRÓXIMA AÇÃO: Avaliar a capacidade dos nós e considerar a adição de mais recursos ou a redução das solicitações de CPU do pod.
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- contains: passou; Assertion passed

- contains: passou; Assertion passed

- regex: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 929; julgamento 0.
## Caso 3 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 760 ms. Custo estimado de geração: US$ 0.00017774999999999998.

Output:

```text
Nenhum pod problemático no snapshot.
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 666; julgamento 0.
## Caso 3 — openai:gpt-4o-mini

Resultado: passou.
Latência: 1072 ms. Custo estimado de geração: US$ 9.884999999999999e-05.

Output:

```text
Nenhum pod problemático no snapshot.
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- regex: passou; Assertion passed

Tokens registrados: geração 635; julgamento 0.
