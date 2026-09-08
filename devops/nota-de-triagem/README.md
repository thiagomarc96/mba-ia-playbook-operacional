---
nome: Nota de triagem
descricao: Transforma alertas crus de infraestrutura em notas de triagem padronizadas, limpas e objetivas para a passagem de turno do plantão.
versao: 1.0.0
tags: [operação, confiabilidade]
inputs:
  - nome: alerta_cru
    descricao: Mensagem bruta do alerta disparado pelo sistema de observabilidade.
---

Transforma alertas crus de infraestrutura em notas de triagem padronizadas, limpas e objetivas para a passagem de turno do plantão.

Use com os dados já coletados, substituindo os parâmetros do prompt pelas entradas de `casos.yaml`.

Exemplo:

```bash
npx promptfoo eval -c devops/nota-de-triagem/promptfooconfig.yaml --env-file .env --no-cache --max-concurrency 1 --delay 4500
```

Modelos nas execuções locais documentadas: google:gemini-3.1-flash-lite, openai:gpt-4o-mini. Flash-Lite foi escolhido pelo custo e pela cota; GPT-4o-mini permite comparar outro fornecedor com baixo custo. A latência é medida, não garantida. Veja [outputs e testes reais](../../evidencias/nota-de-triagem.md).

No CI, a comparação usa Gemini 3.5 Flash-Lite e GPT-4o-mini após os erros 503 e a latência do 3.1. Os mesmos três alertas e limites foram preservados.

Curadoria: Comecei com few-shot usando as três notas de referência do enunciado. O modelo menor copiou prazos e abrangência dos exemplos e deixou uma ação incompleta. Troquei por zero-shot com cinco rótulos e instruções diretas; depois removi descrições dentro do formato que estavam sendo copiadas como resposta. Os mesmos três alertas foram preservados. Os testes também rejeitam ação incompleta e cópia da descrição de formato. Outra versão passou a gerar rótulos sinônimos, inclusive no GPT-4.1 mini; a versão final passou a indicar literalmente o início de cada linha. O modelo maior não trouxe vantagem nessa comparação e não foi mantido.

Resultado final: cinco chamadas aprovadas e uma reprovada por latência de 47,8s no Google. As seis respeitaram o formato. Na revisão do conteúdo, rejeitei a afirmação de perda confirmada de dados: o alerta comprova rejeição de eventos, mas não informa se houve recuperação. O escalonamento do Forge deve ser @data-platform; a resposta OpenAI sugeriu @sre. Aumentar réplicas ou reiniciar um job exige verificar capacidade e segurança de reprocessamento antes de executar. Os asserts de formato não detectaram esses problemas.

Limitações: a resposta depende da qualidade do snapshot e não executa ações. Recomendações exigem revisão do plantonista. Os dados fictícios foram preservados; em produção, sanitizar antes do envio conforme [privacidade](../../privacidade.md).
