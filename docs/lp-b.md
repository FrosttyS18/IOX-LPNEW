# LP B — estado e continuidade

Implementação solicitada pelo designer em 11/11/2026, a partir do frame vivo `126:4352` do arquivo Figma `wRhCFXKO2CGyRhq5I3kHPK`. É a versão com monograma glass no hero e formulário no final. A outra B (`154:5295`), com formulário no topo, não faz parte desta publicação.

## Endereços e fonte

- LP A: `https://iox-lpnew.pages.dev/`.
- LP B: `https://iox-lpnew.pages.dev/lp-b/`.
- Projeto Pages `iox-lpnew`, conta Frostty, mesmo repositório e stack estática.
- Leitura e exportação pelo Talk local; nenhum ajuste no Figma. Canal atual registrado no workspace: `11ji6oq9`, porta 3055. Não usar MCP oficial ou mouse/teclado para este trabalho.
- Capturas, árvore nativa, mapa textual e origens dos assets: `C:/iox/work/lp-b-web-2026-11-11/`.

## Arquivos e composição

- `src/lp-b/content.json`: copy extraída do frame atual, com identificação da fonte; 7 respostas do FAQ, 7 campos e 15 opções.
- `src/lp-b/assets.json`: URLs no CDN próprio para os sete assets da B e as fontes/recortes existentes. Arquivos exportados do Figma, otimizados proporcionalmente, sem imagem gerada nova.
- `scripts/render-b.mjs`: estrutura semântica e conteúdo presente no HTML. O gráfico usa as mesmas 2.450 cotações documentadas na A, com cor dourada na B conforme seu frame; A continua verde.
- `src/lp-b/styles.css`: estilos próprios, com fundo#090a0a, superfícies#141719 e dourado#e6c27a. Entrelinha mínima de 135% conforme instrução do designer. Em 1440 o hero ocupa1312×650, o corpo1200 e o banner1312×540. Em 1920 o hero chega a1616×760; monograma e aro são afastados para impedir sobreposição. Até1250px o texto precede o monograma, e o banner mantém a família abaixo do texto, sem cortar rostos; em1280/1366 o hero preserva as duas colunas com monograma menor. O desktop1440 mantém a composição do frame.
- `src/lp-b/main.mjs`: navegação/foco, campos e seleção múltipla de investimentos. Reutiliza o menu lateral, selects, revelações e gráfico do projeto.
- `scripts/build-b.mjs`: gera `/lp-b/index.html`, CSS e módulo próprios, com URLs versionadas contra mistura de cache. O pacote de publicação inclui A e B; `/lp-b` redireciona para `/lp-b/`.

## Interação e limites

O FAQ tem 18 px nas perguntas e 16 px nas respostas, começa com as sete perguntas fechadas, conforme pedido posterior do designer, e pode ser expandido por toque ou teclado. Setas para baixo giram para cima quando abertas. O menu mobile entra da direita. Dropdowns têm seta com recuo e foco visual por teclado. “Onde você já investe?” permite múltiplas opções, conforme o próprio placeholder do Figma.

O formulário valida os campos e, após preenchimento válido, abre a P3 compartilhada em `/obrigado/?origem=b`. O aviso provisório de indisponibilidade foi removido por pedido explícito do designer. Não envia dados nem integra CRM, e-mail ou WhatsApp nesta fase de validação. A origem permite apenas retornar para a LP correta; nenhum dado pessoal vai para URL ou armazenamento do navegador.

O rodapé usa o texto legal integral fornecido pelo usuário em `src/legal.json`, fonte de 10 px e controle nativo Ver mais/Ver menos. Isso preserva a decisão posterior ao aviso abreviado do briefing. O primeiro parágrafo fica visível; os outros 13 ficam disponíveis ao expandir. Dados e períodos do conteúdo aprovado não são atualizados automaticamente.

## Validação

`npm run build` e `npm test` cobrem ambas as páginas. A conferência da B no workspace verifica 13 larguras(320,369,393,412,609,768,1024,1100,1250,1280,1366,1440,1920), fontes reais, assets carregados, texto sem corte e medidas dos blocos principais contra o Figma. Também verifica FAQ, legal, menu, selects, múltiplas escolhas, ausência de envio, foco de teclado, filtros e tooltip persistente durante arraste touch, com rolagem vertical preservada. A passou novamente pelos testes de regressão em 7 larguras.

As capturas são evidência técnica e visual de implementação, não aprovação estética ou institucional. A meta do projeto continua aguardando aprovação explícita do designer; não encerrar o plugin ou a prévia por conta própria.

## Revisão de espaçamento — 11/11/2026

Pedido do designer após revisar a página publicada: aumentar o respiro entre as seções. Cada transição passou a ter40px adicionais acima de800px e24px até800px, incluindo a entrada do rodapé. Os intervalos internos, dimensões dos cards, fontes, imagens e conteúdo foram preservados. Essa revisão explícita substitui apenas as coordenadas verticais do frame inicial; a composição interna continua a mesma. Conferência visual desktop/mobile e QA13larguras em work/lp-b-web-2026-11-11/qa-respiro-local.json.

## FAQ recolhido — 11/11/2026

Pedido posterior: todas as perguntas fechadas para reduzir rolagem e setas em lugar de+/−. Removida também a altura mínima fixa914px da seção; os intervalos externos aprovados permanecem. HTML nativo details/summary preserva teclado, toque e acesso às respostas sem JavaScript. A LP A e o Figma não foram alterados.
