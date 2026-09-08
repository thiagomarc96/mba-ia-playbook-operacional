# etapas-da-migracao-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 20685 ms. Custo estimado de geração: US$ 0.0011915.

Output:

```text
### Plano de Migração Incremental: Forge Event-Driven

A migração será executada em quatro fases, focadas na mitigação dos riscos de **Degradação de Performance** e **Inconsistência de Billing**.

#### Etapas da Migração

1.  **Fase 1: Shadow Processing (Sombra)**
    *   **Ação:** Implementar o *consumer* do Relay processando em paralelo ao *batch* legado. O resultado é gravado em tabelas temporárias (staging) sem impactar o Sentinel, Cerebro ou Pepper.
    *   **Risco Mitigado:** Degradação de Performance (valida o impacto de escrita sem afetar o DW).
    *   **Critério de Avanço:** Paridade de dados entre o *batch* e o *stream* por 3 ciclos consecutivos.

2.  **Fase 2: Dual-Write (Escrita Dupla)**
    *   **Ação:** O *consumer* passa a gravar nas tabelas de produção, mas o *batch* legado permanece ativo como fonte primária. O *consumer* utiliza *checkpointing* para garantir a continuidade.
    *   **Risco Mitigado:** Inconsistência de Billing (o *batch* garante a precisão financeira enquanto o *stream* é testado).
    *   **Critério de Avanço:** Ausência de divergência nos logs de auditoria entre o *batch* e o *stream*.

3.  **Fase 3: Migração Gradual de Consumidores**
    *   **Ação:** Direcionar o Cerebro (indexação) para ler do *stream*. O Sentinel e a Pepper continuam lendo do *batch*.
    *   **Risco Mitigado:** Efeito Cascata (reduz a carga do *batch* ao remover um dependente).
    *   **Critério de Avanço:** Estabilidade do Cerebro com a nova latência.

4.  **Fase 4: Descomissionamento do Batch**
    *   **Ação:** Migrar Sentinel e Pepper para o *stream*. O *batch* é mantido em modo *standby* por um período de retenção.
    *   **Risco Mitigado:** Acoplamento de Latência (elimina o atraso de 60min).

#### Critérios de Retorno (Rollback)
*   **Gatilho:** Qualquer divergência nos relatórios da Pepper ou falha de *timeout* no DW.
*   **Procedimento:** Reverter o apontamento dos consumidores (Sentinel/Cerebro) para as tabelas particionadas por hora do *batch* legado, que permanecem atualizadas até a conclusão da Fase 4.

Esta estratégia preserva a integridade dos dados, garantindo que o *batch* legado sirva como rede de segurança até que a confiabilidade do *event-driven* seja comprovada.
```

- llm-rubric: passou; 1. Diagnóstico: 2 (Utiliza o diagnóstico de latência e dependentes do Forge). 2. Migração em etapas: 2 (Plano estruturado em 4 fases de transição gradual). 3. Sentinel, Cerebro e Billing: 2 (Plano detalha a migração individual de cada dependente com validação de paridade). 4. Avanço e Rollback: 2 (Define critérios de avanço por fase e procedimento de rollback via re-apontamento para o legado). Total: 8.

Tokens registrados: geração 1606; julgamento 1641.
