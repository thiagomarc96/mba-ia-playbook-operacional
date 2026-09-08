# etapas-da-migracao

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 3658 ms. Custo estimado de geração: US$ 0.001245.

Output:

```text
Para migrar o Forge de *batch* para *event-driven* sem *big-bang*, adotaremos uma estratégia de **Shadow Processing** com segregação de escrita.

### Etapas da Migração

**Fase 1: Shadow Ingestion (Mitigação: Concorrência de Escrita)**
*   **Ação:** O novo processador consome do Relay e grava em tabelas "Shadow" (ex: `dw.tabela_shadow`), distintas das tabelas de produção.
*   **Risco:** Concorrência de escrita no DW.
*   **Critério de Avanço:** Validação de integridade entre `tabela_shadow` e `tabela_batch` via *checksum* de chaves de negócio.
*   **Rollback:** Desligar o consumidor do Relay; tabelas de produção permanecem intactas.

**Fase 2: Validação de Consumo (Mitigação: Latência e Efeito Cascata)**
*   **Ação:** Sentinel e Cerebro passam a ler da `tabela_shadow` em ambiente de teste. O *batch* original continua sendo a fonte da verdade para a Pepper.
*   **Risco:** Inconsistência de dados entre fontes.
*   **Critério de Avanço:** Paridade de resultados entre o processamento *batch* e o *stream* por 3 ciclos consecutivos.
*   **Rollback:** Reverter apontamento dos consumidores para as tabelas originais.

**Fase 3: Migração Gradual de Escrita (Mitigação: Duplicação)**
*   **Ação:** O *batch* original é desativado por etapa (ex: subconjunto de dados). O processador *event-driven* assume a escrita nas tabelas de produção. Para garantir idempotência, o destino deve utilizar *upsert* baseado em chaves de negócio (a definir).
*   **Risco:** Duplicação de dados.
*   **Critério de Avanço:** Sucesso na conciliação financeira da Pepper comparando o processamento *batch* histórico com o novo fluxo.
*   **Rollback:** Reativar o *cron* do *batch* e desativar o escritor do *stream*.

**Fase 4: Descomissionamento**
*   **Ação:** Remoção do *batch* original após estabilidade total.
*   **Risco:** Dependência oculta no *cron*.
*   **Critério de Avanço:** Monitoramento de latência abaixo de 10min por 7 dias.

### Considerações de Segurança
*   **Idempotência:** O processador *event-driven* deve implementar *upsert* para evitar duplicidade caso o Relay reenvie eventos.
*   **Contratos:** A Pepper, Sentinel e Cerebro mantêm seus contratos de leitura; a alteração é transparente, pois o destino final (tabelas) é preservado, apenas a origem da escrita é alternada.
```

- llm-rubric: passou; 1. Diagnóstico: 2/2 (Utiliza o diagnóstico do Forge e seus riscos). 2. Migração em etapas: 2/2 (Define fases claras de Shadow, Validação, Migração e Descomissionamento). 3. Manutenção de dependências: 2/2 (Mantém Sentinel, Cerebro e Pepper com validação de equivalência e sem alteração de contratos). 4. Rollback e Avanço: 2/2 (Prevê critérios de avanço e rollback específicos por etapa, evitando virada única). Total: 8/8.

Tokens registrados: geração 1760; julgamento 1714.
