# training operacao normal pratica CIC — V3.0

PWA de treinamento operacional interativo da FCC U-39, construído com o **Training Scenario Engine** e direcionado às decisões do operador de painel/CIC durante manobras de operação normal.

## V3 — refinamento de qualidade e dificuldade operacional

A V3 **não aumenta artificialmente o número de cenários**. Ela preserva a cobertura integral validada na V2 — **8 documentos, 73 páginas, 35 cenários e 105 decisões** — e trabalha a qualidade pedagógica e a forma de avaliação.

### O que foi refinado

- alternativas A/B/C são **embaralhadas a cada tentativa**, eliminando o padrão de resposta pela posição;
- **46 distratores** de 23 cenários foram reescritos como *near misses*: escolhas tecnicamente próximas, alterando um modo, referência, sequência, tempo ou critério de liberação, sem introduzir fatos externos aos documentos;
- o modo **Avaliação CIC** passou a ocultar fonte, feedback e pontuação por dimensão durante a execução;
- a consequência da decisão anterior acompanha a etapa seguinte, reforçando raciocínio encadeado;
- decisões críticas inadequadas bloqueiam o status de domínio do cenário;
- resultado final compara **Sua decisão × Ação recomendada × Por quê × Consequência**;
- diagnóstico final destaca a dimensão mais fraca: Segurança, Estabilidade, Procedimento ou Coordenação;
- filtro por status permite localizar rapidamente cenários **Dominados**, **A revisar** e **Não iniciados**;
- progresso da V2 é migrado automaticamente para a V3 quando encontrado no mesmo navegador/aparelho.

## Cobertura preservada

1. PE.REF.OPE.CCF.065 — Amostragem de Produtos da Área Fria — 9 páginas.
2. PE.REF.OPE.CCF.066 — Amostragem de Produtos da Área Quente — 9 páginas.
3. PE.REF.OPE.CCF.045 — Desobstrução de Tomadas de PDTs da Slide-Valve L-3902 — 12 páginas.
4. PE.REF.OPE.CCF.044-D — Checklist Desobstrução do PDT-39018C / L-3901 — 4 páginas.
5. PE.REF.OPE.CCF.047 — Lavagem das Turbinas J-3901 e J-3902 — 11 páginas.
6. PE.REF.OPE.CCF.068 — Operação das Válvulas Remosa — 11 páginas.
7. PE.REF.OPE.CCF.064 — Retrolavagem do C-3954 — 9 páginas.
8. PE.REF.OPE.CCF.063 — Transferência do Controle de Pressão do Regenerador D-3904 — 8 páginas.

## Critério de domínio

Um cenário só fica marcado como **Dominado** quando, simultaneamente:

- nota global ≥ 82;
- qualidade decisória ≥ 75;
- nenhuma decisão crítica inadequada.

Esse critério pertence ao mecanismo didático do aplicativo; não é um limite operacional dos procedimentos.

## Publicar no GitHub Pages

1. Substitua os arquivos da V2 pelos arquivos deste ZIP na raiz do repositório.
2. Mantenha `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `sw.js` e a pasta `icons/` na raiz.
3. Faça o commit/push.
4. Se o GitHub Pages já estiver configurado, não é necessário configurar Pages novamente.
5. Abra a página publicada e pressione **Atualizar app**.
6. Se o aparelho ainda mostrar a V2, feche completamente o PWA e abra novamente após a atualização do service worker.

## Nome instalado

`training operacao normal pratica CIC`

O `name` e o `short_name` permanecem exatamente com esse texto.

## Importante

Os PDFs originais não são publicados no PWA. O treinamento representa o conteúdo operacional relevante, priorizando a visão do CIC. Atividades exclusivamente de campo aparecem como coordenação, confirmação, autorização para prosseguir ou consciência situacional quando isso é pertinente ao operador de controle.

Este treinamento é complementar. Em execução real, prevalecem o procedimento vigente, a condição real da unidade e as autorizações operacionais aplicáveis.
