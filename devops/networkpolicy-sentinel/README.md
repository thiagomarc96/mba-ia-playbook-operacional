---
nome: NetworkPolicy do Sentinel
descricao: Corrige manifestos permissivos de NetworkPolicy gerando uma configuração segura, com default-deny, seletores precisos e restrições de tráfego ingress/egress.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: manifesto_permissivo
    descricao: YAML original da NetworkPolicy barrada por excesso de permissões.
  - nome: regras_seguranca
    descricao: Regras corporativas de isolamento de rede da Aegis.
  - nome: mapa_servicos
    descricao: Mapeamento dos namespaces, labels e portas dos serviços autorizados.
---

Corrige manifestos permissivos de NetworkPolicy gerando uma configuração segura, com default-deny, seletores precisos e restrições de tráfego ingress/egress.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/networkpolicy-sentinel/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite, openai:gpt-4o-mini. Flash-Lite foi escolhido pelo custo e pela cota; GPT-4o-mini permite comparar outro fornecedor com baixo custo. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/networkpolicy-sentinel.md).

O CI usa GPT-4o-mini após os erros 503 do Google. As evidências locais abaixo preservam os modelos e resultados de cada rodada.

Curadoria: Geração estruturada, autocrítica e verificação/refino. A v1 duplicou o nome dos recursos e colocou ports dentro do peer. A crítica da IA aprovou indevidamente a indentação e sugeriu retirar o default-deny obrigatório; rejeitei essas sugestões. A v2 ainda tinha YAML inválido. Na v3, um exemplo genérico de sintaxe compacta corrigiu ports e DNS UDP/TCP. O teste foi ajustado para reconhecer corretamente o comentário que o parser YAML associa à primeira regra. Os registros v1, crítica, v2, verificação e v3 estão em ../../evidencias/networkpolicy/. Nenhuma política foi aplicada em cluster.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).

As portas de ingresso não foram informadas: ficam abertas somente para as duas origens selecionadas. Antes de aplicar em produção, conferir portas reais, suporte do CNI e políticas adicionais, pois permissões de NetworkPolicy são cumulativas. A política de liberação substitui o nome original; default-deny usa outro nome.
