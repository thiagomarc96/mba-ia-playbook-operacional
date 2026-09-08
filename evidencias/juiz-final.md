# Verificação final do juiz

Reavaliação de respostas preservadas com GPT-4.1 mini e soma determinística. Não houve nova geração nesta execução. O provedor echo reapresenta os outputs existentes.

## causa-raiz

Resultado: passou. Nota: 6/8.

Output preservado:

```text
**1. Evidências resumidas:**

- **Configuração:**  
  - 12 shards, 1 réplica por shard, heap JVM 8GB, refresh_interval 1s.  
  - Job de reindex agendado às 02:00, duração média 90 min (normalmente termina ~03:30).  
  - Query cache habilitado com 512MB.

- **Métricas (08:00–10:00 UTC):**  
  - Indexed docs/s cresce de 4.2k às 08:00 para 12.4k às 10:00.  
  - Heap usado sobe de 61% (4.9GB) para 94% (7.5GB+).  
  - Latência p99 de busca aumenta de 850ms para 6700ms.  
  - Cache hit rate cai de 74% para 29%.

- **Logs:**  
  - Reindex iniciado às 02:00, mas às 09:20 só 40% (4M/10M docs) concluído, muito atrasado.  
  - GC jovem e antigo com durações crescentes, inclusive pausas longas (~1.8s).  
  - Throttling de indexação iniciado às 08:41 e intensificado às 09:58.  
  - Fila de thread pool de escrita cheia e rejeitando requisições bulk a partir de 09:58.  
  - Circuit breaker de heap acionado às 09:58 (96% uso), causando erros de busca e rejeição.  
  - Erros de busca e falhas parciais a partir de 09:58 até 10:05.

**2. Causa-raiz provável:**

- **Mecanismo da degradação:**  
  A pressão crescente da carga de escrita (indexed_docs/s subindo >3x) sobrecarregou o heap JVM, elevando o uso de memória para níveis críticos (94%), o que levou a frequentes e longas pausas de GC, redução da eficiência do cache e saturação da fila de escrita. Isso causou throttling e rejeição de operações bulk, além de circuit breakers acionados, resultando em lentidão e falhas nas buscas.

- **Motivo inicial do atraso:**  
  O job de reindex, agendado para 02:00 e normalmente concluído em 90 min, estava ainda em 40% às 09:20, indicando atraso significativo. Esse atraso não é explicado diretamente pelos dados, mas pode ter sido causado por carga concorrente alta ou gargalos prévios não registrados. O atraso prolonga a sobrecarga de escrita, agravando a degradação.

**3. Hipóteses e incertezas:**

- Não há evidência direta do gatilho inicial do atraso do reindex (ex.: falha de hardware, concorrência externa, ou gargalo de I/O).  
- A carga de consultas não está documentada, portanto não se pode afirmar se contribuiu para a pressão de heap.  
- Não há dados sobre uso de CPU ou disco, limitando a análise do gargalo exato.  
- O impacto do refresh_interval (1s) na pressão de heap não é quantificado, mas pode contribuir para overhead.

**4. Ação proporcional recomendada:**

- **Contenção imediata:**  
  - Pausar ou reduzir a taxa de ingestão (indexação) temporariamente para aliviar a pressão de heap e permitir que o GC recupere espaço.  
  - Suspender o job de reindex em andamento para evitar competição por recursos.  
  - Monitorar fila de escrita e uso de heap para confirmar recuperação.

- **Investigação posterior:**  
  - Analisar causas do atraso do reindex para evitar reincidência (ex.: gargalos de I/O, concorrência, tuning de refresh_interval).  
  - Avaliar ajuste do refresh_interval para reduzir overhead de escrita.  
  - Considerar tuning do cache e heap se a carga de escrita for recorrente.

**Justificativa:**  
O diagnóstico baseia-se na correlação clara entre aumento da carga de escrita, uso crítico de heap, GC prolongado, throttling e rejeição de operações, que explicam a degradação observada. A contenção da escrita é a medida mais direta e reversível para restaurar a estabilidade, sem necessidade imediata de expansão de recursos. O atraso do reindex é fator agravante, mas seu gatilho inicial permanece incerto.
```

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "Causa-raiz correta",
      "nota": 1,
      "evidencia": "Aponta a pressão da carga de escrita e atraso do reindex como causa provável, mas não identifica claramente que a reindexação travada saturando o heap é a causa raiz, misturando sintomas e causas."
    },
    {
      "criterio": "Correlação × causa",
      "nota": 2,
      "evidencia": "Distingue corretamente que a queda do cache hit e a latência são consequências da pressão de heap e GC, separando causa e efeito."
    },
    {
      "criterio": "Ação proporcional",
      "nota": 2,
      "evidencia": "Propõe pausar ou reduzir a ingestão e suspender o job de reindex para aliviar a pressão, ações coerentes com o diagnóstico sem exagero."
    },
    {
      "criterio": "Honestidade epistêmica",
      "nota": 1,
      "evidencia": "Reconhece incertezas sobre o gatilho inicial do atraso e limitações dos dados, mas algumas afirmações sobre carga e impacto do refresh_interval são feitas sem evidência direta."
    }
  ],
  "total": 6
}
```

Tokens do juiz: 3162.
## A

Resultado: reprovou. Nota: 5/8.

Output preservado:

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

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "Causa-raiz correta",
      "nota": 1,
      "evidencia": "Aponta o esgotamento da heap como causa provável, mas não identifica claramente a reindexação travada saturando o heap como causa raiz, confundindo sintomas com causa."
    },
    {
      "criterio": "Correlação × causa",
      "nota": 2,
      "evidencia": "Distingue corretamente que a queda do cache hit e o aumento do tempo de busca são efeitos da sobrecarga, não causas."
    },
    {
      "criterio": "Ação proporcional",
      "nota": 1,
      "evidencia": "Propõe aumentar a heap e ajustar a reindexação, mas não diferencia claramente entre rever limites e escolher novo tamanho sem evidência concreta."
    },
    {
      "criterio": "Honestidade epistêmica",
      "nota": 1,
      "evidencia": "Reconhece incertezas e limitações dos dados, mas inclui afirmações não totalmente suportadas, como aumento de consultas sem evidência clara e horários específicos inventados."
    }
  ],
  "total": 5
}
```

Tokens do juiz: 2797.
## B

Resultado: passou. Nota: 6/8.

Output preservado:

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

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "Causa-raiz correta",
      "nota": 1,
      "evidencia": "Aponta a concorrência entre reindexação atrasada e carga de escrita/busca como causa, mas não identifica claramente que a reindexação travada saturou o heap, levando ao circuit breaker e queda do cache."
    },
    {
      "criterio": "Correlação × causa",
      "nota": 2,
      "evidencia": "Distingue corretamente que o aumento da carga e a reindexação são causas, enquanto a queda do cache hit é consequência."
    },
    {
      "criterio": "Ação proporcional",
      "nota": 2,
      "evidencia": "Propõe suspender o job de reindexação para liberar recursos e sugere monitoramento e ajustes posteriores, coerente com o diagnóstico."
    },
    {
      "criterio": "Honestidade epistêmica",
      "nota": 1,
      "evidencia": "Reconhece hipóteses e incertezas, mas inclui afirmações não evidenciadas como fatos, como aumento da taxa de indexação sem confirmação e detalhes de horários precisos."
    }
  ],
  "total": 6
}
```

Tokens do juiz: 2872.
## decisao-de-backpressure

Resultado: passou. Nota: 7/8.

Output preservado:

```text
Análise de alternativas de backpressure para o barramento Relay

**Contexto e cálculo preliminar**  
O Relay sustenta 180k msgs/s, mas enfrentou pico de 320k msgs/s por 25 minutos (1500s). O backlog acumulado no pico é:  
backlog = (pico - capacidade) × duração = (320k - 180k) × 1500 = 140k × 1500 = 210 milhões de mensagens.  

Sem taxa posterior informada, consideramos taxa posterior = 0 para cálculo de drenagem mínima, hipótese de limite inferior:  
drenagem = backlog / (capacidade - 0) = 210M / 180k ≈ 1167 segundos (~19,5 minutos).  

Ou seja, mesmo com capacidade total dedicada, levaria quase 20 minutos para drenar o excesso acumulado no pico.

---

### Alternativa 1: Priorização de tráfego (Sentinel com prioridade alta)

**Prós:**  
- Permite que alertas do Sentinel sejam processados com prioridade, reduzindo atraso e potencialmente cumprindo o SLA de 60s.  
- Não requer aumento imediato de capacidade, aproveita a infraestrutura existente.  

**Contras:**  
- Priorizar Sentinel reduz capacidade disponível para Forge, aumentando backlog e atraso na ingestão.  
- Se a capacidade total não for suficiente para o pico, backlog do Forge cresce, podendo ultrapassar o SLA de 15min.  
- Prioridade só ajuda se houver capacidade ociosa ou reservada; no pico, a capacidade está saturada.  

**Impacto orçamentário:**  
- Baixo custo imediato, pois não exige expansão de infraestrutura.  
- Pode gerar custos indiretos se atrasos no Forge causarem penalidades ou retrabalho.  

**Atendimento aos SLAs:**  
- Sentinel: potencial para cumprir SLA de 60s, desde que capacidade seja suficiente.  
- Forge: risco alto de violar SLA de 15min devido aumento do backlog.  

**Risco de perda ou atraso:**  
- Sem aumento de buffer durável, backlog pode causar atrasos significativos.  
- Perda de dados não é mitigada, pois backlog pode exceder retenção.  

---

### Alternativa 2: Particionamento por cliente + autoscaling de consumidores

**Prós:**  
- Particionamento permite isolar cargas, evitando que picos em um cliente impactem outros.  
- Autoscaling de consumidores aumenta capacidade de processamento durante picos, reduz backlog e atraso.  
- Melhora resiliência e escalabilidade do sistema.  

**Contras:**  
- Complexidade operacional maior, requer monitoramento e ajuste dinâmico.  
- Autoscaling pode ter latência para responder ao pico, não eliminando backlog instantaneamente.  
- Requer investimento em automação e possível aumento temporário de custos.  

**Impacto orçamentário:**  
- Aumento potencial de custos de infraestrutura, especialmente em picos.  
- Pode ser mitigado com políticas de escalonamento eficientes e limites orçamentários.  

**Atendimento aos SLAs:**  
- Sentinel: maior chance de cumprir SLA de 60s, pois capacidade aumenta conforme demanda.  
- Forge: redução do backlog e atraso, maior probabilidade de cumprir SLA de 15min.  

**Risco de perda ou atraso:**  
- Reduzido, pois backlog é drenado mais rapidamente.  
- Retenção atual de 4h é suficiente para cobrir atrasos temporários, mas não elimina risco se picos forem maiores ou mais longos.  

---

### Considerações finais e recomendação

- A priorização de tráfego é uma medida de curto prazo, com baixo custo, mas insuficiente para picos extremos, pois não aumenta capacidade e pode comprometer SLA do Forge.  
- Particionamento combinado com autoscaling oferece solução mais robusta, reduz backlog e melhora atendimento aos SLAs, porém com custo e complexidade maiores.  

**Condições mensuráveis para validar a proposta:**  
- Monitorar backlog acumulado e tempo de drenagem após implementação.  
- Medir latência de alertas Sentinel e atraso na ingestão Forge em picos reais.  
- Avaliar custo incremental de infraestrutura e impacto no orçamento trimestral.  
- Garantir que retenção e espaço durável suportem backlog máximo previsto.  

**Recomendação:** avançar com particionamento e autoscaling, implementando também priorização para Sentinel, mas sem depender exclusivamente dela. Essa combinação equilibra risco, custo e SLA, sem prometer garantia absoluta, mas com métricas claras para ajustes contínuos.
```

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "comparação de pelo menos duas alternativas com custos e riscos",
      "nota": 2,
      "evidencia": "A resposta apresenta duas alternativas detalhadas, com prós, contras, impacto orçamentário, atendimento aos SLAs e riscos claramente comparados."
    },
    {
      "criterio": "respeito a Sentinel 60s, Forge 15min, orçamento 8% acima e ausência de perda",
      "nota": 1,
      "evidencia": "A resposta reconhece os SLAs e orçamento, mas não demonstra capacidade para cumprir todos sem perda, especialmente no pico, e não ignora a possibilidade de backlog e atraso no Forge."
    },
    {
      "criterio": "capacidade e limites (excedente 210 milhões de mensagens em 25min, drenagem depende da taxa posterior, DLQ não substitui capacidade)",
      "nota": 2,
      "evidencia": "A resposta calcula backlog e tempo de drenagem considerando hipótese de taxa posterior zero, reconhece limites da capacidade e que backlog pode exceder retenção, sem assumir fatos não demonstrados."
    },
    {
      "criterio": "recomendação proporcional com hipóteses e validação",
      "nota": 2,
      "evidencia": "A recomendação é proporcional, combina alternativas, apresenta hipóteses claras e sugere métricas para validação contínua, sem prometer garantias absolutas."
    }
  ],
  "total": 7
}
```

Tokens do juiz: 1765.
## diagnostico-da-migracao

Resultado: passou. Nota: 8/8.

Output preservado:

```text
Diagnóstico do pipeline Forge baseado em lote (batch):

Fatos e dependências:
- O pipeline atual é acionado por um job cron a cada 60 minutos, com processamento sequencial em Spark que dura cerca de 40 minutos.
- Os dados processados são gravados em tabelas particionadas por hora no data warehouse.
- Três sistemas dependem diretamente dessas tabelas: Sentinel (consumo das tabelas agregadas), Cerebro (indexação dos eventos transformados) e os relatórios de faturamento da Pepper (execução noturna).
- A migração visa substituir o batch por consumo contínuo via Relay, processando em blocos menores, sem interrupção dos consumidores e com possibilidade de rollback.

Pontos frágeis críticos:
- Acúmulo de volume em caso de falha: se um lote falha, o próximo precisa processar o dobro de dados, aumentando risco de atraso e falha em cascata.
- Longo tempo de processamento (40 minutos) reduz a margem para recuperação antes do próximo disparo.
- Dependência direta dos consumidores em tabelas batch-particionadas, que podem não refletir dados em tempo real.
- Risco de concorrência e duplicação na coexistência entre batch e fluxo, especialmente se ambos escreverem nas mesmas tabelas sem coordenação explícita.
- Ausência de garantias explícitas sobre contratos dos consumidores, que podem não aceitar mudanças na forma de acesso (API ou Relay).

Gargalos operacionais:
- Tempo fixo e longo do batch limita a frequência e agilidade na entrega dos dados.
- Falta de mecanismos para lidar com falhas sem acumular volume.
- Dependência de tabelas particionadas por hora, que podem não ser compatíveis com ingestão contínua.

Riscos para consumidores:
- Sentinel, Cerebro e faturamento podem ser impactados por atrasos ou inconsistências durante a transição.
- Mudanças na forma de acesso aos dados podem quebrar contratos existentes.
- Concorrência de escrita entre batch e fluxo pode gerar dados duplicados ou inconsistentes.

Informações faltantes:
- Detalhes sobre mecanismos atuais de controle de duplicação e idempotência.
- Contratos formais e tolerâncias dos consumidores quanto a latência e consistência.
- Capacidade do Relay e do processamento contínuo para suportar carga equivalente.
- Estratégias previstas para sincronização e rollback durante a migração.

Conclusão:
O pipeline batch atual apresenta riscos significativos de acúmulo e falha em cascata, além de dependências rígidas em tabelas particionadas que dificultam a migração incremental para um modelo event-driven. A coexistência temporária entre batch e fluxo requer atenção especial para evitar duplicação e concorrência de escrita, garantindo a continuidade e integridade dos dados para os consumidores.
```

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "descreve cron 60min e 14 etapas Spark em 40min sem inventar dados",
      "nota": 2,
      "evidencia": "A resposta menciona que o pipeline é acionado por um job cron a cada 60 minutos e que o processamento sequencial em Spark dura cerca de 40 minutos, sem inventar dados."
    },
    {
      "criterio": "identifica acúmulo após falha",
      "nota": 2,
      "evidencia": "A resposta identifica claramente que se um lote falha, o próximo precisa processar o dobro de dados, aumentando o risco de atraso e falha em cascata."
    },
    {
      "criterio": "considera Sentinel, Cerebro e billing",
      "nota": 2,
      "evidencia": "A resposta menciona que Sentinel, Cerebro e os relatórios de faturamento da Pepper dependem diretamente das tabelas processadas pelo Forge."
    },
    {
      "criterio": "explicita lacunas necessárias para migrar sem big-bang",
      "nota": 2,
      "evidencia": "A resposta destaca informações faltantes como contratos formais dos consumidores, capacidade do Relay, estratégias para sincronização e rollback, e enfatiza a necessidade de migração incremental sem virada única."
    }
  ],
  "total": 8
}
```

Tokens do juiz: 1330.
## etapas-da-migracao

Resultado: passou. Nota: 8/8.

Output preservado:

```text
Plano de Migração Incremental do Pipeline Forge para Arquitetura Event-Driven

**Etapa 1: Implementação de Processamento Paralelo em Sombra (Shadow Mode)**  
**Risco Relacionado:** Duplicação e Concorrência de Escrita  
- Executar o processamento event-driven em paralelo ao batch atual, consumindo eventos do Relay em pequenos blocos (ex: janelas de 5-10 min).  
- Gravar resultados em tabelas separadas, equivalentes às originais, para evitar interferência e garantir isolamento.  
- Validar a equivalência dos dados produzidos pelo fluxo contínuo com os lotes, por meio de comparações periódicas.  
- Critério de avanço: consistência comprovada entre tabelas batch e event-driven, sem impacto nos consumidores.  
- Rollback: desativar o processamento em sombra sem afetar o batch.

**Etapa 2: Introdução de Escritor Único por Destino com Controle de Idempotência**  
**Risco Relacionado:** Concorrência de Escrita e Duplicação  
- Definir um único processo escritor ativo por tabela/partição para evitar conflitos. Inicialmente, manter o batch como escritor principal.  
- Desenvolver mecanismos de idempotência baseados em chaves de negócio para o event-driven, garantindo que reprocessamentos não causem duplicação.  
- Critério de avanço: validação da idempotência e ausência de locks ou corrupção nas partições.  
- Rollback: manter batch como escritor exclusivo, suspender event-driven.

**Etapa 3: Migração Gradual dos Consumidores para as Tabelas Event-Driven**  
**Risco Relacionado:** Contratos de Consumo e Dependências  
- Migrar consumidores (Sentinel, Cerebro, Pepper) para lerem as tabelas event-driven de forma incremental, por escopo controlado (ex: por área de negócio ou partição horária).  
- Durante a transição, manter ambos os conjuntos de tabelas disponíveis para garantir reversibilidade.  
- Critério de avanço: consumidores operando corretamente com dados event-driven, sem perda de funcionalidade.  
- Rollback: retorno ao consumo exclusivo das tabelas batch.

**Etapa 4: Desativação Progressiva do Batch e Consolidação do Event-Driven**  
**Risco Relacionado:** Efeito Cascata e Latência  
- Após validação completa, reduzir gradualmente a frequência e volume do batch, até sua desativação total.  
- Monitorar latência e estabilidade, garantindo que o processamento event-driven atenda aos SLAs.  
- Critério de avanço: estabilidade operacional e latência dentro dos limites esperados.  
- Rollback: reativar batch em caso de falhas críticas.

**Considerações Finais:**  
Cada etapa deve ser acompanhada de métricas claras e checkpoints para rollback. A migração evita big-bang, preserva contratos e dependências, e garante operação contínua. A estratégia incremental mitiga riscos de duplicação, concorrência e falhas em cascata, assegurando a integridade e confiabilidade do pipeline Forge.
```

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "usa o diagnóstico recebido",
      "nota": 2,
      "evidencia": "O plano aborda explicitamente os riscos e pontos frágeis do diagnóstico, como duplicação, concorrência de escrita, contratos de consumo e efeito cascata."
    },
    {
      "criterio": "migra em etapas para consumo contínuo em pequenos blocos",
      "nota": 2,
      "evidencia": "A migração é dividida em quatro etapas claras, começando com processamento em sombra consumindo pequenos blocos de eventos (5-10 min), evitando big-bang."
    },
    {
      "criterio": "mantém Sentinel, Cerebro e billing com validação de equivalência",
      "nota": 2,
      "evidencia": "O plano prevê validação periódica da equivalência dos dados entre batch e event-driven e migração incremental dos consumidores, mantendo ambos os conjuntos de tabelas disponíveis para reversibilidade."
    },
    {
      "criterio": "prevê avanço e rollback por etapa sem virada única",
      "nota": 2,
      "evidencia": "Cada etapa inclui critérios claros de avanço e rollback, permitindo reversão sem impacto, evitando virada única (big-bang)."
    }
  ],
  "total": 8
}
```

Tokens do juiz: 1821.
## plano-da-migracao

Resultado: passou. Nota: 8/8.

Output preservado:

```text
Plano da Migração – Detalhamento Técnico e Runbook de Reversibilidade

---

**Fase 1: Shadow Ingestion**  
- **Execução Proposta:** O novo processador consome eventos do Relay e grava exclusivamente em tabelas `dw.tabela_shadow`, separadas das tabelas de produção para evitar concorrência de escrita.  
- **Mitigação de Risco:** Substituir dupla escrita sem controle por segregação clara; garantir que apenas o escritor batch original grave nas tabelas de produção.  
- **Interrupção e Replay:** Antes de reativar qualquer lote, interromper o escritor novo (desligar consumidor do Relay), reconciliar a janela de ingestão e retomar a partir do último checkpoint seguro, explicitando replay dos eventos para garantir atualização completa da `tabela_shadow`.  
- **Validação Mensurável:** Comparar checksums das chaves de negócio entre `tabela_shadow` e `tabela_batch` para validar integridade.  
- **Critério de Parada:** Se divergência for detectada, investigar antes de avançar; não assumir tolerância financeira inventada.  
- **Rollback:** Desligar consumidor do Relay; manter batch ativo e tabelas de produção intactas.  
- **Offsets/Checkpoints:** Controlar offsets no Relay para garantir replay seguro e evitar perda ou duplicação.  

---

**Fase 2: Validação de Consumo**  
- **Execução Proposta:** Redirecionar Sentinel e Cerebro para leitura das tabelas `tabela_shadow` em ambiente de teste, mantendo batch como fonte da verdade para Pepper.  
- **Mitigação de Risco:** Evitar efeito cascata por latência ou inconsistência; validar paridade entre batch e stream.  
- **Validação Mensurável:** Confirmar paridade de resultados por 3 ciclos consecutivos (ex: 3 horas).  
- **Critério de Parada:** Divergência exige rollback imediato e investigação.  
- **Rollback:** Reverter apontamento dos consumidores para tabelas batch originais.  
- **Offsets/Checkpoints:** Garantir que leitura do Sentinel e Cerebro respeite checkpoints para evitar leitura parcial ou duplicada.  

---

**Fase 3: Migração Gradual de Escrita**  
- **Execução Proposta:** Desativar batch por subconjuntos (ex: partições horárias); o processador event-driven assume escrita nas tabelas de produção.  
- **Mitigação de Risco:** Evitar duplicação por meio de chave estável de evento e operação atômica *upsert* no destino, validada pelo schema.  
- **Interrupção e Replay:** Em caso de falha, interromper escritor stream, reativar batch para o subconjunto afetado, e realizar replay do Relay a partir do checkpoint seguro para sincronizar estado.  
- **Validação Mensurável:** Conciliação financeira da Pepper comparando histórico batch com dados do fluxo em tempo real.  
- **Critério de Parada:** Divergência financeira ou falha na conciliação exige rollback.  
- **Rollback:** Reativar cron batch para subconjunto, desativar escritor stream correspondente.  
- **Offsets/Checkpoints:** Controlar rigorosamente para evitar perda ou duplicação; replay necessário para lote em standby não presumido atualizado.  

---

**Fase 4: Descomissionamento**  
- **Execução Proposta:** Após estabilidade total, remover batch original.  
- **Mitigação de Risco:** Monitorar dependências ocultas no cron batch para evitar falhas silenciosas.  
- **Validação Mensurável:** Monitoramento contínuo de latência abaixo de 10 minutos por 7 dias.  
- **Critério de Parada:** Qualquer aumento de latência ou falha detectada suspende descomissionamento.  
- **Rollback:** Reativar batch e cron se necessário.  

---

**Considerações Gerais**  
- **Idempotência:** Implementar *upsert* com chave estável para garantir unicidade e evitar duplicação, validada pelo schema.  
- **Contratos:** Preservar tabelas e contratos de leitura da Pepper, Sentinel e Cerebro; alteração transparente para consumidores.  
- **Replay e Checkpoints:** Não presumir lote standby atualizado; explicitar replay para sincronização.  
- **Investigação de Divergências:** Divergências financeiras ou de integridade não devem ser mascaradas; exigem investigação detalhada antes de avançar.  
- **Relatórios de Billing:** Validar resultados financeiros da Pepper em cada fase para garantir consistência.  

---

Este plano detalha a execução técnica e o runbook de reversibilidade para garantir migração segura, incremental e auditável do Forge para processamento em tempo real, minimizando riscos e preservando a integridade dos dados e dos consumidores.
```

Julgamento real:

```json
{
  "criterios": [
    {
      "criterio": "detalha as etapas recebidas com execução e aceite",
      "nota": 2,
      "evidencia": "O plano detalha claramente as quatro fases da migração, incluindo ações, critérios de avanço, validações mensuráveis e rollback para cada etapa."
    },
    {
      "criterio": "cobre integridade de Sentinel, Cerebro e billing",
      "nota": 2,
      "evidencia": "O plano menciona explicitamente a validação da paridade para Sentinel e Cerebro e a conciliação financeira da Pepper para billing em fases distintas."
    },
    {
      "criterio": "rollback operacional com condição de parada e restauração do lote",
      "nota": 2,
      "evidencia": "O plano define rollback claros com condições de parada, incluindo desligar consumidores, reativar batch para subconjuntos e replay a partir de checkpoints, sem presumir lote standby atualizado."
    },
    {
      "criterio": "trata offsets/checkpoints, replay e idempotência sem prometer garantias não demonstradas",
      "nota": 2,
      "evidencia": "O plano aborda controle rigoroso de offsets e checkpoints, explicita necessidade de replay para sincronização e implementa upsert com chave estável para idempotência, sem prometer ausência de perda sem mecanismo."
    }
  ],
  "total": 8
}
```

Tokens do juiz: 2418.
