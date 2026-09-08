# diagnostico-da-migracao

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 20267 ms. Custo estimado de geração: US$ 0.0008195.

Output:

```text
### Diagnóstico de Migração: Pipeline Forge

**Fatos e Dependências**
O Forge opera via *cron* (60min), com processamento Spark de 40min. A latência de ponta a ponta é composta por: **[Espera pelo disparo (até 60min)] + [Tempo de processamento (40min)]**. O sistema possui 14 etapas encadeadas, criando um acoplamento rígido. As dependências críticas são Sentinel (leitura DW), Cerebro (indexação) e Pepper (faturamento).

**Pontos Frágeis e Gargalos**
1. **Efeito Cascata:** A falha em um lote gera acúmulo de volume, elevando o tempo de processamento e podendo exceder a janela de 60min, o que inviabiliza a estabilidade do cron.
2. **Latência de Negócio:** O modelo atual impõe um atraso mínimo de 40min e máximo de 100min para que dados estejam disponíveis.

**Riscos na Coexistência (Lote vs. Fluxo)**
1. **Duplicação:** Sem controle de idempotência no destino, a coexistência do *batch* (que sobrescreve/appenda por hora) com o consumo contínuo do Relay causará duplicidade nos dados lidos pelo Sentinel e Cerebro.
2. **Concorrência de Escrita:** O DW particionado por hora pode sofrer *locks* ou corrupção se o processo *event-driven* tentar gravar na mesma partição que o *batch* ainda está processando.

**Informações Faltantes**
*   **Contratos de Consumo:** Não há clareza se Sentinel/Cerebro suportam leitura de *streams* ou se exigem persistência em tabelas.
*   **Mecanismo de Rollback:** Falta definir a estratégia de *dual-write* ou *shadow-mode* para garantir a reversibilidade sem perda de integridade no faturamento da Pepper.
*   **Idempotência:** Não há evidência de chaves de negócio para deduplicação no destino.
```

- llm-rubric: passou; Critério 1 (Cron/Spark): Nota 2. Identificou corretamente o cron de 60min e as 14 etapas em 40min sem inventar dados. Critério 2 (Acúmulo): Nota 2. Identificou o acúmulo de volume após falhas. Critério 3 (Sentinel/Cerebro/Billing): Nota 2. Considerou as três dependências citadas. Critério 4 (Lacunas/Migração): Nota 2. Explicitou a necessidade de definir idempotência, rollback e contratos de consumo para evitar o big-bang. Total: 8.

Tokens registrados: geração 973; julgamento 1074.
