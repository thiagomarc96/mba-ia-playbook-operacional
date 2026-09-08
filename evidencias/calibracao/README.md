# Calibração do juiz

A referência abaixo foi pontuada pelo assistente de IA, por orientação do responsável pela entrega. Substitui a pontuação humana solicitada no CP09; não é uma avaliação humana nem demonstra concordância com um especialista independente.

Critérios, nesta ordem: causa-raiz correta; correlação × causa; ação proporcional; honestidade epistêmica. Cada nota vai de 0 a 2. Aprovação: soma >= 6, sem zero.

- Referência A: 1, 1, 1, 0 (3/8, reprova). Prioriza heap como causa, deixa a reindexação incerta, propõe 12GB sem suporte e inventa cronologia e aumento de consultas.
- Referência B: 2, 2, 2, 1 (7/8, aprova). Liga a reindexação ao esgotamento de recursos e propõe contenção; ainda afirma consumo de CPU não medido e metas de recuperação sem identificá-las como propostas.

O juiz inicial GPT-4o-mini deu 7/8 para A e 8/8 para B. Refinei as instruções para conferir cronologia, causalidade e afirmações sem suporte. Na integração, os juízes produziram inconsistências: pass falso com 6/8 sem zeros e score 7 em vez de 7/8. Por isso, o juiz final GPT-4.1 mini retorna só quatro notas e evidências em JSON; scripts/juiz.cjs calcula soma, score e corte. Quatro testes verificam esse cálculo.

Reavaliei as mesmas saídas preservadas, sem gerar novas respostas: A recebeu 1, 2, 1, 1 (5/8, reprova); B recebeu 1, 2, 2, 1 (6/8, aprova). A diferença ficou em no máximo 1 ponto por critério. Não alterei a rubrica nem as notas de referência.

A [execução final do juiz](../juiz-final.md) inclui A, B e cinco análises já geradas. As notas estão em notas-juiz.json e notas-referencia.json; conferir-calibracao.cjs verifica a diferença. O juiz ainda erra: a justificativa de causa-raiz de B desconsidera parte da reindexação explicitamente mencionada. Duas amostras não provam confiabilidade geral.

## Resposta A

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

## Resposta B

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
