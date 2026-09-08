# causa-raiz-google

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: erro de API.
Latência: 34832 ms. Custo estimado de geração: US$ 0.

Output:

```text
(sem resposta)
```

Erro: Error: No candidates returned in API response.

Got response: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}

Tokens registrados: geração 0; julgamento 0.
