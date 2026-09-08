# decisao-de-backpressure

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 4341 ms. Custo estimado de geração: US$ 0.001408.

Output:

```text
Como Principal Systems Architect na Aegis, analiso a sobrecarga do Relay sob a ótica de resiliência e viabilidade operacional.

### Análise de Carga
Com base no incidente (pico de 320k msgs/s por 25 min e capacidade sustentada de 180k msgs/s), o excedente acumulado é:
*   **Backlog:** (320k - 180k) msgs/s × 1.500s = **210 milhões de mensagens**.
*   **Drenagem:** Assumindo uma taxa posterior de processamento igual à capacidade sustentada (180k msgs/s) e entrada zero (hipótese de limite inferior), o tempo mínimo de drenagem seria de **1.166 segundos (~19,4 minutos)**.

### Comparativo de Alternativas

#### 1. Priorização de Tráfego (Sentinel vs. Forge)
*   **Mecânica:** Implementar filas distintas ou *weighted fair queuing* para garantir que o Sentinel (SLA 60s) tenha prioridade sobre o Forge (SLA 15min).
*   **Prós/Contras:** Protege o SLA do Sentinel. Contudo, não resolve a sobrecarga total; o Forge sofrerá *starvation* durante o pico, aumentando seu lag além dos 15 min.
*   **Impacto:** Baixo custo direto, mas exige refatoração no barramento.
*   **Risco:** Se a capacidade total for insuficiente, o Forge acumulará um backlog que pode exceder a retenção de 4h, levando à perda de dados.

#### 2. Autoscaling de Consumidores (Horizontal Scaling)
*   **Mecânica:** Escalar instâncias do Forge e Sentinel dinamicamente conforme o lag ou uso de CPU.
*   **Prós/Contras:** Aumenta a capacidade de drenagem, reduzindo o tempo de recuperação.
*   **Impacto:** Aumento direto no custo de infraestrutura (OPEX), pressionando o orçamento já excedido em 8%.
*   **Risco:** O *cold start* de novos consumidores pode ser lento demais para picos súbitos, e o barramento pode se tornar o gargalo se não houver particionamento adequado.

### Considerações sobre DLQ e Retenção
A DLQ é uma ferramenta de tratamento de erros (mensagens malformadas), não um buffer de sobrecarga. Utilizá-la para desviar tráfego de pico é um erro arquitetural, pois não provê capacidade de processamento e introduz complexidade na re-ingestão. A retenção de 4h é insuficiente para o volume de 210 milhões de mensagens se a capacidade de drenagem não for superior à taxa de entrada.

### Recomendação
Não é possível garantir o cumprimento dos SLAs sem o aumento da capacidade de processamento (Autoscaling) ou a implementação de priorização estrita. 

**Condições para validação:**
1.  **Benchmarking de Capacidade:** Medir a taxa máxima de processamento por instância do Forge/Sentinel para definir o número de réplicas necessárias para absorver 320k msgs/s.
2.  **Monitoramento de Lag:** Implementar alertas baseados no tempo de processamento (SLA) e não apenas no volume.
3.  **Teste de Estresse:** Simular o pico de 320k msgs/s em ambiente de staging para validar se o tempo de drenagem permanece abaixo dos limites de retenção e SLA.

A priorização é a medida de curto prazo mais segura para o Sentinel, enquanto o autoscaling deve ser condicionado à análise de custo-benefício frente ao risco de perda de dados.
```

- llm-rubric: passou; 1. Comparação de alternativas: Nota 2. Compara priorização e autoscaling, abordando custos e riscos. 2. Respeito às restrições: Nota 2. Não prometeu perda zero ou cumprimento de SLA sem capacidade, reconheceu o risco orçamentário e a insuficiência da retenção. 3. Capacidade e limites: Nota 1. Calculou o excedente corretamente, mas tratou a taxa de drenagem como hipótese (correto), porém não demonstrou a relação entre a drenagem e o limite de 15min do Forge de forma conclusiva. 4. Recomendação proporcional: Nota 2. Recomendação baseada em hipóteses e validação via testes de estresse e benchmarking.

Tokens registrados: geração 1522; julgamento 1493.
