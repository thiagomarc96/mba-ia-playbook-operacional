# plano-da-migracao

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 37002 ms. Custo estimado de geração: US$ 0.0015527499999999999.

Output:

```text
Este plano detalha a transição do Forge para *event-driven*, focando na integridade e reversibilidade.

### Diretrizes Técnicas de Transição
*   **Idempotência:** Substituir inserções simples por operações *upsert* (ou `MERGE`) baseadas em chaves de negócio estáveis. Validação de *schema* obrigatória no destino para rejeitar eventos malformados.
*   **Reconciliação:** Em caso de falha, o escritor novo é interrompido via *kill signal* no orquestrador. A reconciliação exige o *replay* do *offset* do Relay a partir do último *checkpoint* seguro, garantindo que a janela de tempo perdida seja processada antes da reativação do lote.
*   **Segregação:** Proibida a escrita concorrente. A transição de um escritor para outro exige o bloqueio do *cron* do *batch* antes da ativação do *stream* para o mesmo subconjunto de dados.

### Fases de Execução

**Fase 1: Shadow Ingestion**
*   **Execução:** Consumidor *event-driven* grava exclusivamente em `tabela_shadow`.
*   **Validação:** *Checksum* de chaves de negócio entre `tabela_shadow` e `tabela_batch`.
*   **Condição de Parar:** Divergência de *checksum* ou erro de *schema*.
*   **Rollback:** Desligar consumidor *stream*; manter *batch* ativo.

**Fase 2: Validação de Consumo**
*   **Execução:** Sentinel e Cerebro leem da `tabela_shadow`. Pepper mantém leitura do *batch*.
*   **Validação:** Paridade de resultados entre *batch* e *stream* por 3 ciclos.
*   **Condição de Parar:** Inconsistência nos relatórios de *billing* da Pepper.
*   **Rollback:** Apontar Sentinel/Cerebro de volta para tabelas originais.

**Fase 3: Migração Gradual de Escrita**
*   **Execução:** Desativação do *cron* do *batch* para subconjuntos. Ativação do escritor *stream* nas tabelas de produção via *upsert*.
*   **Validação:** Conciliação financeira da Pepper (comparação de totais processados). Divergências exigem investigação imediata.
*   **Condição de Parar:** Duplicação de registros ou falha na conciliação financeira.
*   **Rollback:** Interromper escritor *stream*, realizar *replay* do *batch* para o período afetado, reativar *cron*.

**Fase 4: Descomissionamento**
*   **Execução:** Remoção definitiva do *cron* e limpeza de tabelas *shadow*.
*   **Validação:** Monitoramento de latência < 10min por 7 dias.
*   **Condição de Parar:** Latência superior ao limite ou falha na entrega ao Cerebro.
*   **Rollback:** Reinstalação do *cron* a partir de *backup* de configuração.

### Gestão de Falhas e Integridade
*   **Offsets:** O *checkpoint* deve ser persistido apenas após a confirmação da transação de escrita no destino.
*   **Replay:** Em falhas, o *offset* é retrocedido ao último *commit* bem-sucedido. O *replay* é obrigatório para garantir que nenhum evento do Relay seja ignorado durante a janela de indisponibilidade.
*   **Billing:** Relatórios de *billing* devem ser validados em cada fase, tratando a transição como uma mudança de fonte de dados, não de lógica de negócio.
```

- llm-rubric: passou; 1. Etapas e Execução: Nota 2. Detalha fases com ações, critérios de aceite e condições de parada claras. 2. Integridade (Sentinel, Cerebro, Billing): Nota 2. Cobre a transição de leitura para Sentinel/Cerebro e a validação financeira da Pepper (billing) em todas as fases. 3. Rollback: Nota 2. Define parada e restauração via replay do batch/offset, evitando reativação cega. 4. Idempotência/Offsets: Nota 2. Implementa upsert/MERGE, checkpoints pós-commit e replay de offsets, sem promessas vazias.

Tokens registrados: geração 2121; julgamento 2112.
