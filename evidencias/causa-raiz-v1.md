# causa-raiz-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 5442 ms. Custo estimado de geração: US$ 0.0006163499999999999.

Output:

```text
**Evidências Resumidas:**

1. **Configuração do Cluster (cerebro.yaml)**:
   - Shards: 12, Replicas: 1, Heap: 8GB, Refresh Interval: 1s.
   - Reindexação programada para 02:00, com duração média de 90 minutos.

2. **Métricas de Performance**:
   - A partir das 08:00 UTC, o tempo de busca (search_p99_ms) aumentou de 850ms para 6700ms até 10:00 UTC.
   - O uso de heap subiu de 61% para 94% no mesmo período, enquanto a taxa de acerto do cache caiu de 74% para 29%.

3. **Logs Nativos**:
   - 08:14: GC jovem durou 620ms, heap de 4.9GB para 3.1GB.
   - 09:31: Circuit Breaker acionado, uso de heap em 86%.
   - 09:58: Thread pool de escrita cheio, rejeitando requisições (EsRejectedExecutionException).
   - 10:01: CircuitBreakingException devido a dados excessivos.

**Causa-raiz Provável:**
A degradação de performance é atribuída ao esgotamento da memória heap, que levou ao acionamento do Circuit Breaker e à rejeição de requisições. O aumento no tempo de busca e a queda na taxa de acerto do cache indicam que o sistema estava sobrecarregado, possivelmente devido à reindexação em andamento e à alta carga de consultas.

**Hipóteses Levantadas e Incertezas:**
- A reindexação pode ter contribuído para a carga excessiva, mas não está claro se o volume de dados ou a configuração do cluster são os principais responsáveis pela degradação.
- Não há dados suficientes para determinar se a configuração de shards e replicas é adequada para a carga atual.

**Ação Proporcional Recomendada:**
1. **Aumentar a Heap**: Considerar aumentar a memória heap para 12GB, se a infraestrutura permitir, para evitar o acionamento do Circuit Breaker.
2. **Ajustar a Reindexação**: Alterar o horário da reindexação para um período de menor carga ou dividir a tarefa em partes menores.
3. **Monitorar Performance**: Implementar monitoramento mais rigoroso para identificar picos de carga e ajustar a configuração do cluster conforme necessário.

**Justificativa do Diagnóstico:**
A análise das métricas e logs indica que a degradação de performance foi causada por uma combinação de alta carga de consultas e reindexação, resultando em esgotamento de recursos. Aumentar a heap e ajustar a reindexação são passos críticos para restaurar a performance do sistema.
```

- llm-rubric: passou; {'Causa-raiz correta': {'nota': 2, 'evidência': 'Identificou o esgotamento da memória heap como causa da degradação.'}, 'Correlação × causa': {'nota': 2, 'evidência': 'Distinção clara entre a queda do cache hit e a causa do problema.'}, 'Ação proporcional': {'nota': 2, 'evidência': 'Recomendações para aumentar a heap e ajustar a reindexação são adequadas.'}, 'Honestidade epistêmica': {'nota': 1, 'evidência': 'Reconhece incertezas sobre a contribuição da reindexação, mas poderia ser mais explícito.'}}

Tokens registrados: geração 2330; julgamento 2549.
