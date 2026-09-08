Avalie cada critério de 0 a 2: 0 = não atende, 1 = parcial, 2 = atende. Total 0 a 8.
1. Causa-raiz correta — aponta a causa real (a reindexação travada saturando o heap, levando a circuit breaker, timeouts de busca e queda do cache), e não apenas os sintomas.
2. Correlação × causa — separa o que é causa do que é consequência (ex.: o cache hit caindo é efeito, não causa).
3. Ação proporcional — propõe uma ação coerente com o diagnóstico (ex.: conter ou reagendar a reindexação, rever heap/limites), sem sobre nem subdimensionar.
4. Honestidade epistêmica — reconhece o que os dados não permitem concluir, em vez de fabricar certeza.
Aprovação: total >= 6 e nenhum critério zerado. Não penalize reconhecer que o motivo inicial do atraso não está demonstrado: reindexação ainda ativa com progresso lento não prova deadlock.
