# networkpolicy-sentinel-v1

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: erro de API.
Latência: 18788 ms. Custo estimado de geração: US$ 0.

Output:

```text
(sem resposta)
```

Erro: Error: No candidates returned in API response.

Got response: {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}

Tokens registrados: geração 1760; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: reprovou.
Latência: 4218 ms. Custo estimado de geração: US$ 0.0004994999999999999.

Output:

```text
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sentinel-allow
  namespace: sentinel-prod
spec:
  podSelector: {}          # aplica a todos os pods do namespace
  policyTypes:
    - Ingress
    - Egress
  ingress: []              # bloqueia todo o tráfego de entrada (default-deny)
  egress: []               # bloqueia todo o tráfego de saída (default-deny)

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sentinel-allow
  namespace: sentinel-prod
spec:
  podSelector:
    matchLabels:
      app: sentinel       # seleciona apenas os pods com label app=sentinel
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: relay-prod  # permite tráfego do namespace relay-prod
          podSelector:
            matchLabels:
              app: relay                               # permite tráfego dos pods com label app=relay
      # Permite tráfego de entrada do Relay (consumo de eventos)
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: edge      # permite tráfego do namespace edge
          podSelector:
            matchLabels:
              app: api-gateway                        # permite tráfego dos pods com label app=api-gateway
      # Permite tráfego de entrada do gateway de API da plataforma
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: forge-prod # permite tráfego para o namespace forge-prod
          podSelector:
            matchLabels:
              app: forge                              # permite tráfego para os pods com label app=forge
          ports:
            - port: 5432                             # permite tráfego para a porta 5432 (Postgres do warehouse)
      # Permite tráfego de saída para o Forge (warehouse)
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: cerebro-prod # permite tráfego para o namespace cerebro-prod
          podSelector:
            matchLabels:
              app: cerebro                            # permite tráfego para os pods com label app=cerebro
          ports:
            - port: 9200                             # permite tráfego para a porta 9200 (Elasticsearch)
      # Permite tráfego de saída para o Cerebro (busca)
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system # permite tráfego para o namespace kube-system
          podSelector:
            matchLabels:
              k8s-app: kube-dns                       # permite tráfego para os pods com label k8s-app=kube-dns
          ports:
            - port: 53                               # permite tráfego para a porta 53 (DNS interno)
      # Permite tráfego de saída para o DNS interno
```

Erro: Custom function returned false
file://verificar.cjs

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- not-contains: passou; Assertion passed

- javascript: reprovou; Custom function returned false
file://verificar.cjs

Tokens registrados: geração 1407; julgamento 0.
