# decisao-de-backpressure-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 12664 ms. Custo estimado de geração: US$ 0.00135675.

Output:

```text
Como Principal Systems Architect na Aegis, analiso o cenário do barramento Relay sob a premissa de resiliência absoluta.

### Análise de Sobrecarga
*   **Excedente Acumulado:** No pico de 320k msgs/s (delta de 140k msgs/s sobre o sustentado de 180k) por 25 minutos (1.500s), o volume excedente é de **210 milhões de mensagens**.
*   **Tempo de Drenagem:** Assumindo que a capacidade de processamento pós-pico retorne ao sustentado (180k msgs/s) e que o barramento opere com margem de 10% para novas entradas, a capacidade de drenagem líquida é de 18k msgs/s. O tempo mínimo para drenar o excedente é de **~3,25 horas**.

---

### Comparativo de Alternativas

#### 1. Priorização de Tráfego (Sentinel vs. Forge)
*   **Mecânica:** Implementação de *Consumer Groups* distintos com priorização no barramento. O Sentinel consome com prioridade máxima; o Forge consome o excedente.
*   **Prós/Contras:** Garante o SLA de 60s do Sentinel. O Forge sofrerá atrasos, mas dentro da janela de 15min.
*   **Orçamento:** Baixo impacto (ajuste de configuração).
*   **Risco:** Se o volume do Sentinel exceder a capacidade de processamento, o atraso é inevitável. Não resolve a falta de buffer durável.

#### 2. Autoscaling de Consumidores + Buffer Durável
*   **Mecânica:** Escalonamento horizontal agressivo dos consumidores Forge/Sentinel baseado em *lag* de fila, aliado ao aumento da retenção do barramento para 6h.
*   **Prós/Contras:** Alta resiliência. O aumento da retenção atua como buffer de sobrecarga.
*   **Orçamento:** Alto impacto (custo de instâncias e armazenamento).
*   **Risco:** Risco de *thundering herd* ao escalar. A DLQ não é solução aqui, pois apenas desvia mensagens sem processá-las.

---

### Avaliação de Riscos e SLAs
A DLQ é um mecanismo de tratamento de erros (mensagens "venenosas"), não uma estratégia de backpressure. Utilizá-la para sobrecarga causaria perda de ordem e falha no SLA de telemetria. O orçamento atual (8% acima) restringe o *autoscaling* desenfreado.

### Recomendação
Proponho uma **abordagem híbrida de priorização com retenção seletiva**:

1.  **Priorização (Imediato):** Configurar o barramento para priorizar o tráfego do Sentinel. Isso garante o SLA de 60s mesmo sob carga.
2.  **Buffer de Retenção:** Aumentar a retenção do barramento para 6h. Isso é mais barato que escalar instâncias de consumidores para o pico máximo, permitindo que o Forge "drene" o excedente no seu ritmo, respeitando o SLA de 15min.
3.  **Garantia:** Esta estratégia evita a perda de dados (requisito de Steve Rogers) sem estourar o orçamento com *overprovisioning* de instâncias, utilizando o armazenamento do barramento como buffer elástico.

**Nota:** A viabilidade desta proposta depende da capacidade de escrita do barramento suportar o pico de 320k msgs/s sem degradação de latência. Caso contrário, o particionamento por cliente será necessário para isolar falhas.
```

- llm-rubric: passou; 1. Comparação de alternativas: Nota 2. Comparou priorização vs. autoscaling com custos e riscos. 2. Respeito a restrições: Nota 2. Considerou SLAs (60s/15min), orçamento e a premissa de perda zero. 3. Capacidade e limites: Nota 2. Calculou corretamente o excedente de 210M, o tempo de drenagem e identificou corretamente que DLQ não resolve capacidade. 4. Recomendação: Nota 2. Proposta híbrida com hipótese de validação sobre a capacidade de escrita do barramento.

Tokens registrados: geração 1352; julgamento 1393.
