# plano-da-migracao-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 8340 ms. Custo estimado de geração: US$ 0.001382.

Output:

```text
Este plano detalha a transição do Forge para processamento em tempo real, garantindo a integridade financeira e operacional.

### Plano de Execução e Runbook

| Fase | Execução Proposta | Validação (Sentinel/Cerebro/Billing) | Condição de Parada | Rollback |
| :--- | :--- | :--- | :--- | :--- |
| **1. Shadow** | Consumo paralelo via Relay; escrita em staging. | Paridade de registros entre *batch* e *staging*. | Divergência > 0.01% nos logs. | Desativar *consumer* do Relay. |
| **2. Dual-Write** | Escrita em produção via *stream* e *batch*. | Auditoria de Billing (Pepper) vs. *stream*. | Divergência financeira detectada. | Desativar escrita do *stream* no DW. |
| **3. Migração** | Cerebro aponta para o *stream*. | Latência de indexação no Cerebro. | Timeout ou erro de leitura. | Reverter *endpoint* do Cerebro para *batch*. |
| **4. Final** | Sentinel/Pepper apontam para o *stream*. | Estabilidade do DW e relatórios Pepper. | Falha de processamento contínuo. | Reverter apontamento para *batch* (standby). |

### Integridade e Confiabilidade
Para evitar perda ou duplicação de dados, o sistema utilizará:
*   **Idempotência:** Cada evento processado terá um *ID* único (hash do evento original). O *consumer* verificará a existência do registro no destino antes da escrita (UPSERT).
*   **Offsets/Checkpoints:** O *consumer* salvará o *offset* do Relay apenas após a confirmação da escrita no DW. Em caso de falha, o processamento reinicia do último *checkpoint* validado.
*   **Replay:** Em caso de falha de processamento, o *consumer* será reiniciado a partir do *offset* anterior, garantindo que nenhum evento do Relay seja ignorado.

### Relatórios de Billing e Contingência
Os relatórios da **Pepper** são o balizador crítico. Durante a Fase 2, a Pepper comparará o *output* do *batch* (fonte da verdade) com o *stream*. Qualquer discrepância nos valores de faturamento disparará um alerta imediato.

**Plano de Contingência:**
1.  **Falha de Fluxo:** Se o *consumer* parar, o *batch* legado (que permanece ativo até a Fase 4) absorverá a carga, pois o *batch* ainda processa os dados brutos do *storage* original.
2.  **Degradação de Performance:** Caso o *stream* cause latência no DW, o *consumer* será pausado e o volume será processado via *batch* até que o ajuste de *tuning* seja validado em ambiente de teste.
3.  **Validação:** O Sentinel e o Cerebro atuarão como validadores de integridade; se a contagem de eventos no Sentinel divergir da contagem de entrada do Relay, o sistema interrompe a transição para investigação.

Este plano assegura que o *batch* legado atue como *failover* contínuo, eliminando o risco de "virada única" e garantindo a precisão do billing.
```

- llm-rubric: passou; 1. Etapas com execução e aceite: Nota 2. O plano detalha as 4 fases com ações claras e critérios de validação/parada. 2. Integridade de Sentinel, Cerebro e billing: Nota 2. O plano aborda explicitamente a transição e validação para os três componentes. 3. Rollback operacional: Nota 2. Define condições de parada e restauração do lote (standby) para cada fase. 4. Offsets, checkpoints, replay e idempotência: Nota 2. Explica o uso de UPSERT para idempotência, controle de offset pós-escrita e estratégia de replay. Total: 8/8.

Tokens registrados: geração 1868; julgamento 1956.
