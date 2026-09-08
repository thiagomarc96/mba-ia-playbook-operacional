# diagnostico-da-migracao-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 3440 ms. Custo estimado de geração: US$ 0.0007862500000000001.

Output:

```text
### Relatório de Diagnóstico: Pipeline Forge

**Fatos e Dependências:**
O Forge opera via *batch* (cron 60min) com 14 etapas Spark (40min de execução). A latência de dados é de, no mínimo, 40-60 minutos. O sistema possui dependentes críticos: Sentinel (leitura DW), Cerebro (indexação) e Pepper (faturamento). O particionamento atual é por hora.

**Pontos Frágeis e Gargalos:**
1. **Efeito Cascata:** A falha em um lote gera acúmulo de volume, aumentando o tempo de processamento e o risco de *timeout* ou estouro de memória no próximo ciclo.
2. **Acoplamento de Latência:** O modelo atual impõe um atraso fixo aos consumidores, impedindo reações em tempo real.
3. **Risco de Consistência:** A transição para *event-driven* exige que o novo fluxo mantenha a integridade dos dados esperada pelo Sentinel e Cerebro, que hoje dependem de tabelas particionadas por hora.

**Riscos da Migração:**
* **Degradação de Performance:** A mudança para processamento contínuo pode sobrecarregar o DW se não houver ajuste na estratégia de escrita (evitar *small files*).
* **Inconsistência de Billing:** O faturamento da Pepper depende de dados consolidados; qualquer falha na transição pode impactar a precisão financeira.

**Informações Faltantes:**
* **Schema do Relay:** Não há definição da estrutura dos eventos de entrada.
* **SLA de Consumo:** Qual a latência máxima aceitável para o Sentinel e Cerebro no novo modelo?
* **Mecanismo de Rollback:** Não há estratégia definida para sincronizar o estado entre o *batch* legado e o novo *stream* durante a transição gradual (dual-write ou shadow mode).

**Recomendação:** Priorizar a implementação de um *consumer* que suporte *checkpointing* para evitar perda de dados durante a transição.
```

- llm-rubric: passou; 1. Cron 60min e 14 etapas Spark 40min: Nota 2 (descritos corretamente). 2. Acúmulo após falha: Nota 2 (identificado como efeito cascata). 3. Sentinel, Cerebro e billing: Nota 2 (todos citados). 4. Lacunas para migrar sem big-bang: Nota 2 (identificou falta de estratégia de rollback/sincronização e dual-write). Total: 8.

Tokens registrados: geração 895; julgamento 1000.
