# causa-raiz

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 3880 ms. Custo estimado de geração: US$ 0.0016237500000000002.

Output:

```text
### 1. Evidências Resumidas
*   **Cronologia:** O job de reindexação (iniciado às 02:00) deveria finalizar às 03:30, mas às 09:58 estava em apenas 41% de progresso.
*   **Métricas:** Entre 08:00 e 10:00, a taxa de indexação saltou de 4.2k para 12.4k docs/s, o *heap* subiu de 61% para 94% e o *cache hit ratio* despencou de 74% para 29%.
*   **Logs:** A partir das 08:41, o sistema iniciou *throttling* de escrita. Às 09:58, o *thread pool* de escrita saturou (200/200), seguido pelo disparo do *circuit breaker* (96% de uso do heap) e rejeição de requisições.

### 2. Causa-raiz Provável
A causa-raiz é a **concorrência de recursos entre o job de reindexação atrasado e a carga de escrita/busca em tempo real**. O job de reindexação, operando fora da janela prevista, consumiu ciclos de CPU e memória (heap) que, somados ao aumento da carga de escrita, exauriram o *buffer* de indexação e o *query cache*. O mecanismo de degradação foi o *thrashing* de memória: a pressão de escrita forçou GC frequente, reduzindo a eficiência do cache, o que aumentou o tempo de busca e, consequentemente, o tempo de retenção de objetos no heap, culminando no disparo do *circuit breaker*.

### 3. Hipóteses e Incertezas
*   **Hipótese:** O atraso do job de reindexação foi causado por um volume de dados maior que o habitual ou contenção de I/O no armazenamento, não evidenciado nos logs.
*   **Incerteza:** Não é possível confirmar se o aumento na taxa de indexação (4.2k para 12.4k docs/s) foi uma carga legítima de negócio ou um efeito colateral de retentativas automáticas de clientes após as primeiras lentidões.

### 4. Ação Recomendada
*   **Contenção Imediata:** Suspender/cancelar o job de reindexação (`task 88123`) para liberar recursos de CPU e memória imediatamente.
*   **Investigação Posterior:** Analisar o histórico de logs de I/O para entender por que o job de reindexação não concluiu na janela de 90 minutos.
*   **Recuperação:** Monitorar o *heap_used_pct* e o *write thread pool queue*. A recuperação será confirmada quando o *heap* estabilizar abaixo de 70% e o *query cache hit ratio* retornar aos níveis normais (>70%).
*   **Ajuste:** Avaliar a implementação de *index lifecycle management* (ILM) ou limitar a prioridade de recursos do job de reindexação para evitar que ele impacte o tráfego de produção.
```

- llm-rubric: passou; {'Causa-raiz correta': {'nota': 2, 'evidência': 'Identificou a concorrência de recursos como causa principal.'}, 'Correlação × causa': {'nota': 2, 'evidência': 'Distinção clara entre o aumento do cache hit e a causa do problema.'}, 'Ação proporcional': {'nota': 2, 'evidência': 'Ação de suspender o job de reindexação é adequada ao diagnóstico.'}, 'Honestidade epistêmica': {'nota': 2, 'evidência': 'Reconheceu incertezas sobre a causa do atraso na reindexação.'}}

Tokens registrados: geração 2980; julgamento 2598.
