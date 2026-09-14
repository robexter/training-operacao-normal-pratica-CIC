# QA Report — V3.0

## Cobertura

- Arquivos-fonte representados: **8/8**.
- Páginas previamente inspecionadas e preservadas na cobertura: **73/73**.
- Cenários: **35**.
- Decisões: **105**.
- Distribuição: 20 cenários Avançados, 12 Especialistas e 3 Intermediários.
- Foco: operador de painel/CIC; execução física de campo não é atribuída indevidamente ao controlador.

## Refinamento de dificuldade

- Alternativas refinadas: **46**.
- Cenários com distratores revisados: **23**.
- O conteúdo correto das 105 decisões foi preservado.
- Cada decisão continua possuindo uma única alternativa recomendada no modelo de dados.
- A ordem exibida A/B/C é embaralhada em tempo de execução.

## Verificações automáticas

- `node --check app.js`: **OK**.
- `manifest.webmanifest` válido como JSON: **OK**.
- IDs de cenário únicos: **OK**.
- 35 cenários / 105 decisões: **OK**.
- Todas as decisões com ≥3 alternativas: **OK**.
- Exatamente uma alternativa recomendada por decisão: **OK**.
- Recursos declarados no Service Worker presentes: **OK**.
- Cache atualizado para V3: **OK**.
- Estrutura GitHub Pages preservada: **OK**.

## Observação de projeto

A V3 é um refinamento pedagógico. O limite de domínio (82/75/zero críticas) é uma regra do simulador para estudo e não deve ser interpretado como limite de processo ou critério formal da unidade.
