# DevOps

Prompts voltados a **infraestrutura, automação e operação** de sistemas: pipelines de CI/CD, containers, orquestração, provisionamento, observabilidade, confiabilidade e segurança operacional.

## Escopo

Entram aqui prompts relacionados a:

- Pipelines de CI/CD (GitHub Actions, GitLab CI, Jenkins etc.).
- Containers e orquestração (Docker, Kubernetes, Helm).
- Infraestrutura como código (Terraform, Pulumi, Ansible).
- Provedores de nuvem (AWS, GCP, Azure) e seus recursos.
- Observabilidade (logs, métricas, tracing, alertas, dashboards).
- Confiabilidade, SRE, postmortems e análise de incidentes.
- Segurança operacional (hardening, secrets, políticas de acesso).

## Fora de escopo

- Escrita de código de aplicação → usar `desenvolvimento/`.
- Conteúdo educacional sobre DevOps (aulas, artigos, vídeos) → usar `criacao-conteudo/`.

## Prompts

- [Triagem de pods](triagem-de-pods/): Realiza triagem rápida e confiável da saúde dos pods em um cluster Kubernetes a partir de um snapshot contendo lista de pods, eventos do describe e logs anteriores.
- [Nota de triagem](nota-de-triagem/): Transforma alertas crus de infraestrutura em notas de triagem padronizadas, limpas e objetivas para a passagem de turno do plantão.
- [Causa-raiz](causa-raiz/): Cruza a configuração do cluster, métricas de JVM e logs nativos para diagnosticar incidentes complexos de performance e indisponibilidade no Cerebro.
- [Decisão de backpressure](decisao-de-backpressure/): Compara alternativas arquiteturais de backpressure e mitigação de sobrecarga no barramento Relay, pesando SLAs, custos e restrições.
- [Diagnóstico da migração](diagnostico-da-migracao/): Analisa o estado atual do pipeline Forge baseado em lote (batch) para identificar pontos de fragilidade e dependências críticas antes da migração para event-driven.
- [Etapas da migração](etapas-da-migracao/): Recebe o diagnóstico do Elo 1 e desenha a estratégia de migração em passos incrementais (sem big-bang), garantindo reversibilidade.
- [Plano da migração](plano-da-migracao/): Recebe as etapas do Elo 2 e detalha o plano técnico de execução e mitigação de riscos para cada fase da transição do Forge.
- [NetworkPolicy do Sentinel](networkpolicy-sentinel/): Corrige manifestos permissivos de NetworkPolicy gerando uma configuração segura, com default-deny, seletores precisos e restrições de tráfego ingress/egress.
