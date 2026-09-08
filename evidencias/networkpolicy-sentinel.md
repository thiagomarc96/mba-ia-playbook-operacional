# networkpolicy-sentinel

Execução real de `promptfoo eval`. O relatório separa falhas dos asserts de erros do provedor.

## Caso 1 — google:gemini-3.1-flash-lite

Resultado: passou.
Latência: 3069 ms. Custo estimado de geração: US$ 0.0010115.

Output:

```text
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: sentinel-prod
spec:
  # Bloqueio total de tráfego Ingress e Egress para isolar o namespace
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress: []
  egress: []
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sentinel-allow
  namespace: sentinel-prod
spec:
  podSelector:
    matchLabels:
      app: sentinel
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Entrada permitida apenas do Relay
    - from:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: relay-prod}}
          podSelector: {matchLabels: {app: relay}}
    # Entrada permitida apenas do API Gateway
    - from:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: edge}}
          podSelector: {matchLabels: {app: api-gateway}}
  egress:
    # Saída para Forge (Postgres)
    - to:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: forge-prod}}
          podSelector: {matchLabels: {app: forge}}
      ports: [{port: 5432, protocol: TCP}]
    # Saída para Cerebro (Elasticsearch)
    - to:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: cerebro-prod}}
          podSelector: {matchLabels: {app: cerebro}}
      ports: [{port: 9200, protocol: TCP}]
    # Saída para DNS interno
    - to:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: kube-system}}
          podSelector: {matchLabels: {k8s-app: kube-dns}}
      ports: [{port: 53, protocol: UDP}, {port: 53, protocol: TCP}]
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- not-contains: passou; Assertion passed

- javascript: passou; Assertion passed

Tokens registrados: geração 1561; julgamento 0.
## Caso 1 — openai:gpt-4o-mini

Resultado: passou.
Latência: 3099 ms. Custo estimado de geração: US$ 0.00044534999999999996.

Output:

```text
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: sentinel-prod
spec:
  podSelector: {}  # aplica a todos os pods do namespace
  policyTypes:
    - Ingress
    - Egress
  ingress: []  # bloqueia todo tráfego de entrada
  egress: []   # bloqueia todo tráfego de saída

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sentinel-allow
  namespace: sentinel-prod
spec:
  podSelector: {matchLabels: {app: sentinel}}  # aplica apenas aos pods do Sentinel
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Permite tráfego de entrada do Relay (consumo de eventos)
    - from:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: relay-prod}}
          podSelector: {matchLabels: {app: relay}}
    # Permite tráfego de entrada do API gateway da plataforma
    - from:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: edge}}
          podSelector: {matchLabels: {app: api-gateway}}
  egress:
    # Permite tráfego de saída para o Forge (warehouse, porta 5432)
    - to:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: forge-prod}}
          podSelector: {matchLabels: {app: forge}}
      ports: [{port: 5432, protocol: TCP}]
    # Permite tráfego de saída para o Cerebro (busca, porta 9200)
    - to:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: cerebro-prod}}
          podSelector: {matchLabels: {app: cerebro}}
      ports: [{port: 9200, protocol: TCP}]
    # Permite tráfego de saída para DNS interno
    - to:
        - namespaceSelector: {matchLabels: {kubernetes.io/metadata.name: kube-system}}
          podSelector: {matchLabels: {k8s-app: kube-dns}}
      ports: [{port: 53, protocol: UDP}, {port: 53, protocol: TCP}]
```

- latency: passou; Assertion passed

- cost: passou; Assertion passed

- not-contains: passou; Assertion passed

- javascript: passou; Assertion passed

Tokens registrados: geração 1493; julgamento 0.
