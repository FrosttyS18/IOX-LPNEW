# LPs A/B e jornada — publicação e próxima revisão

## Estado vigente — implementação autorizada em 11/11/2026

**Revisão mobile solicitada em11/11:** logo branco em caixa preta removido. SVG preto com fundo transparente extraído diretamente das quatro curvas/clips vetoriais da página9 do Manual de Branding - IOX_compressed.pdf oficial (Dropbox id:OcGwBJ7cq74AAAAAAAAHCw), sem reconstrução por IA ou traçado de bitmap. Fonte versionada em assets/iox-logo-preto.svg e publicação no CDN próprio,1927bytes. Mobile usa40px sem padding/fundo. Sim/Não das etapas2/3/5 lado a lado,56px de altura; rodapé mantém ações visíveis com16px de respiro e botão48px. Cabeçalho/progresso/formulário tiveram intervalos compactados; grupos de palavras longos deixaram de ser nowrap, preservando IOX90 e valores. Scroll interno intencional só quando necessário, barra Chrome3px discreta e fallback thin. Desktop e copy/regras preservados. QA50estados em320/360/393/412/1738;21após refinamento;28testes. Renders1/3/6/8/9mobile conferidos. Evidências qa-compacto-metricas.json,qa-fixed-actions-compacto.json e fixed-compacto-* emwork/jornada-iox90-v2-2026-11-11/.


**Auditoria de conteúdo:** 43 trechos e opções dos módulos atuais comparados à copy integral do Léo, sem divergências. Evidência: `work/jornada-iox90-v2-2026-11-11/auditoria-copy-codigo-atual.json`. O formulário e a jornada já estão publicados para revisão. Permanecem fora desta entrega as integrações de CRM/Meta/envio real, conforme instrução do designer; revisão humana continua pendente.

**Publicação atual:** c8600016d025964e15b4bc78ca85c6b90e4b8416 no GitHub; Pages f1f582b8-32e3-4ba0-8159-eb3956abbb19, sucesso/canônico. Inclui rodapé fixo e painel proporcional de7ab79d6 e apresentação dos dois primeiros nomes. Arquivos públicos conferidos contra dist, agenda404. Registros abaixo de outras publicações são históricos.

**Nome na apresentação final — pedido do designer em 11/11:** mostrar apenas os dois primeiros nomes, juntos na mesma linha, mesmo que o contato informe o nome completo. O nome original permanece integral em memória no formulário/lead para futura integração, sem truncar o dado. A apresentação escapa HTML e ajusta somente o tamanho do nome se necessário para caber. QA local: 20 combinações em 320/360/393/1440, incluindo nome longo, nome único e LP B; nomes unidos, sem overflow/erro JS e nome original preservado ao voltar. Renders 360/393 conferidos; 28 testes passaram.

**Revisão de celular e notebook solicitada pelo designer:** viewport1738×803 reproduziu corte vertical de133px na arte do painel: o comportamento cover cortava logo/identificação. Agora a coluna e o painel preservam9:22 e se ajustam proporcionalmente à altura disponível, sem recortar o bitmap. O designer pediu Voltar/Continuar sempre visíveis e rolagem só no conteúdo. A jornada usa100dvh, cabeçalho/progresso e ações permanecem no viewport; apenas `.j-content` rola. As quebras manuais do Figma foram retiradas no mobile: fluxo natural/balance e unidades IOX90, valores monetários,90dias e frases curtas protegidas. Copy e regra Não2/3/5 preservadas; Figma não alterado nesta revisão de comportamento. A etapa4 desktop fica mais compacta em notebooks baixos e mantém as duas perguntas; mobile continua4A/4B.

QA antes/depois em6viewportsnotebook e54estados comprovou o corte anterior e a correção proporcional. QA de ações fixas:107estados em11viewports de320×640 a1738×803, incluindo360×640/720,393×660/852 e1366×768. Botões visíveis antes/depois de rolar o conteúdo, nenhum scroll do diálogo inteiro, sem overflow horizontal e sem br forçado no mobile. Renders inspecionados;27testes passaram. Evidências `qa-notebook-before/after.json`, `qa-fixed-actions-final.json`, `fixed-final-*` na pasta da jornada. Essa revisão substitui o posicionamento vertical estático do rodapé anterior; a rolagem interna é intencional conforme pedido explícito.

O designer autorizou expressamente “PODE IMPLEMENTAR” e depois pediu push para testar no site. Os dois formulários embarcados abrem a mesma Jornada IOX 90 v2, em uma vista de página inteira na identidade A. A tela final personalizada substitui o antigo obrigado com agenda. As URLs antigas `/obrigado/` e `/conversa/` retornam à LP de origem; o pacote publicado deixa de incluir a agenda e o quiz antigo.

- Nove etapas, com saída ao responder Não em 2, 3 ou 5, exatamente conforme a copy do Léo.
- Na etapa 4, desktop apresenta patrimônio e suitability juntos. Mobile apresenta 4A e 4B, preservando respostas e mantendo “Etapa 4 de 9”, com 44%.
- Etapa 6: lâmina em botão preto, texto e ícone de download brancos. O Figma também foi ajustado nos frames 224:1109 e 224:1130. Mobile 4B acrescentado em 224:1714, ao lado de 211:199.
- Painel desktop exportado do original aprovado 224:840, otimizado em WebP e no CDN próprio. Logo mobile, fontes e controles preservam o padrão aprovado; quebras manuais são derivadas do snapshot do Figma, sem mudar a copy.
- Check preto/branco desenhado uma vez na tela 9; movimento reduzido apresenta o resultado imediatamente.
- Voltar, retorno ao site e Escape preservam os dados do formulário da LP enquanto a visita permanece aberta. Nenhum contato vai em URL, local/sessionStorage, logs ou POST. Não há ActiveCampaign, Meta, CRM, agendamento ou envio real.
- Os módulos novos estão em `src/conversation/journey*`; build e pacote versionam suas dependências e não publicam os módulos antigos de agenda/quiz. As fontes antigas foram preservadas como histórico.

Validação local: build e 27 testes passaram; 109 estados/caminhos em 12 larguras (320–1920), retorno sem perda, três saídas em A/B, opção sem contato, toque real e redução de movimento. Zero erros JavaScript, overflow horizontal ou POST nos cenários testados. Root conferiu renders com fontes e imagens reais do CDN. Evidências: `C:/iox/work/jornada-iox90-v2-2026-11-11/qa-runtime.json` e `web-*`. A validação técnica não substitui a revisão estética ou institucional.

A lâmina continua no único arquivo oficial disponível, agosto de 2026; substituir quando o cliente fornecer o arquivo atual. Meta, plugin Talk, ponte 3055 e prévia 4184 devem permanecer abertos. As seções seguintes registram o histórico anterior, não instruem a restaurar a agenda ou o formulário de quatro telas.

**Publicado para revisão:** código `b05c492` (implementação em `0492668`), push confirmado no GitHub. Cloudflare Pages `d54fcdd2-97b3-4fd0-85c6-99cd27453fcd` em sucesso e canônico em 11/11/2026. QA pública: 23 estados/caminhos, A/B, saídas, toque, teclado/foco/retorno e URLs antigas; nove arquivos públicos byte-idênticos ao dist. `/conversation/agenda.mjs` responde 404. Refinamento final do texto de encerramento preserva largura621px no desktop conforme Figma. Evidências `qa-runtime-publico.json`, `qa-keyboard-publico.json`, `check-release.json` e `publico-final-1440.png` na pasta da jornada. Nenhum envio ou integração real foi ativado. O designer está testando; não concluir a meta nem fechar o plugin.

**Regra esclarecida ao designer:** Não à pergunta “Você sabe o que é um FIDC?” (tela5) também leva à saída, mesmo após Sim nas telas2/3. Essa regra está expressa na copy fornecida pelo Léo; não foi inventada nem revista pelo assistente.

**Conferência posterior de fidelidade — 11/11:** a auditoria das medidas encontrou opções 7/8 em duas colunas no desktop, divergindo do Figma (840px, empilhadas). Corrigidas no mesmo fluxo, junto dos intervalos verticais das opções 2–5/7/8 e do texto final. Quebras dos rótulos longos mobile 7/8 agora vêm das camadas nativas do Figma, sem alterar copy. O verificador reproduziu falha antes da correção (primeira opção mobile2 em293px em vez de310px) e passou depois:15grupos de opções + mensagens finais conferidos em393/1440. Build27testes e regressão57estados/caminhos em6larguras passaram; zeroerroJS/POST/overflow horizontal. Evidências `qa-fidelity.cjs`, `qa-fidelity.json`, `fidelity-*` e `qa-runtime.json`. Links reais da lâmina/PDF e MaisRetorno responderam200. São ajustes da implementação, sem mexer no Figma ou nas regras de qualificação.

## Histórico — definição e montagem da Jornada IOX 90 v2

Os registros desta seção descrevem decisões antes da autorização de implementação. O estado vigente está no início do documento: jornada publicada nas LPs A/B. As referências abaixo a implementação futura ou site f09c03e são históricas e não representam pendências atuais.

**Substitui o planejamento anterior:** os formulários embarcados da **LP A e da LP B** vão abrir a mesma jornada após o envio. São nove telas e uma saída condicional. Nome e contato vêm da LP. A nova tela final substitui o encerramento com agenda. Não existem duas identidades ou um novo formulário de contato na última etapa.

Copy integral fornecida pelo Léo, preservada em `C:/iox/documentos/Jornada-IOX90-v2-copy-Leo-2026-11-11.md`. Não reescrever condições, valores ou regra de saída: **Não nas telas 2, 3 ou 5 → saída**. Tela 4 tem patrimônio e suitability; tela 8 inclui não receber contato.

**Fase autorizada agora: Figma primeiro, na área existente `211:2`. Código e site permanecem em f09c03e até aprovação/solicitação posterior.** Os IDs Figma abaixo pertencem ao layout anterior publicado e estão sendo reaproveitados: não usá-los como fonte do fluxo antigo em futuras implementações. Snapshot anterior preservado em `C:/iox/work/jornada-iox90-v2-2026-11-11/antes.json`; montagem e registro dos novos IDs na mesma pasta.

O restante deste documento descreve exclusivamente a **versão anterior ainda publicada**, não o novo escopo. Nenhuma integração foi autorizada.

### Layout v2 concluído para revisão

**Proveniência do painel preto:** “Jornada IOX 90” foi acrescentado pelo assistente como identificação visual, usando o nome do documento “Jornada IOX 90 | v2”. Não consta como texto de tela na copy do Léo e não foi aprovado pelo designer. O designer perguntou sua origem e recebeu essa explicação; não pediu remoção nem autorizou implementação. Preservar a revisão em andamento. Progresso, Voltar e os botões Continuar adicionais também são controles de layout, não novas mensagens comerciais do Léo.

**Revisão visual posterior aplicada em11/11:** prevalece o segundo print do designer, `codex-clipboard-36aa8b0b-d54b-4fd6-9d52-bdc8646b3f8c.png`. A identificação anterior saiu; agora o painel360×880 tem logo44×44 em32,32; “IOX 90” em263,38 (77×33, PJRegular24,32px/LH135%); monograma320×320 em20,227; arte de arcos na base, com o recorte definido pelo designer. Original224:840 preservado e clonado às demais nove telas desktop. Geometria/cores/tipografia equivalentes nos dez painéis; conteúdo das20telas fora do painel idêntico ao snapshot anterior, incluindo todo mobile. Renders das telas2eSaída conferidos. Evidências `antes-ajuste-painel.json`, `qa-painel.json`, `painel-propagacao.json` e manifesto atualizado na pasta da jornada. `montar.mjs` conserva o histórico da montagem inicial e não deve ser reexecutado para reconstruir esse painel, pois recriaria a direção anterior. Ler o Figma vivo e o manifesto atualizado. Aprovação geral do fluxo e implementação no site continuam pendentes.

Montado pessoalmente via Talk to Figma, canal atual `bswv02n6`, preservando seção e frames antigos reaproveitados. São 20 frames editáveis, Plus Jakarta Sans, entrelinha mínima 135%, branco/preto/verde da identidade A. Nenhuma LP ou código de produção alterado nesta etapa.

| Tela | Desktop | Mobile |
|---|---|---|
| 1 Abertura | 211:3 | 211:30 |
| 2 Investidor qualificado | 211:54 | 211:90 |
| 3 Passe de entrada | 211:123 | 211:145 |
| 4 Perfil | 211:164 | 211:199 |
| 5 FIDC | 224:1069 | 224:1090 |
| 6 O fundo | 224:1109 | 224:1130 |
| 7 Momento | 224:1149 | 224:1173 |
| 8 Como seguir | 224:1195 | 224:1219 |
| 9 Final | 211:231 | 211:243 |
| Saída | 224:1263 | 224:1272 |

Os caminhos estão indicados nas legendas externas do canvas. Não foi implementado protótipo clicável ou lógica de ramificação no Figma. A jornada funcional no site continua pendente de aprovação e pedido de implementação.

QA: root viu as vinte telas; 216 textos do manifesto conferidos com o documento vivo, sem divergências, fontes inadequadas, entrelinha abaixo de135% ou texto fora do respectivo pai. Perfil desktop refinado para1440×960; mobile393×1213 para acomodar os dois grupos sem comprimir opções; demais mobile393×852. Snapshot, copy, manifesto e renders finais em `C:/iox/work/jornada-iox90-v2-2026-11-11/`. A exportação de alguns frames em coordenadas muito altas omitiu camadas; capturas finais verificadas com reposicionamento temporário para exportar e devolução dos mesmos frames às coordenadas da sequência. Não confundir essa falha de exportação com conteúdo removido.

Conferência adicional independente do manifesto: os48trechos do documento de copy do Léo foram confrontados com nova leitura do Figma vivo em ambos os formatos,96comparações e nenhuma ausência. Evidência em `auditoria-copy-independente.json` na pasta da jornada. Checkout segue f09c03e, somente este documento técnico modificado; nenhum código ou site alterado. Próxima ação depende da revisão/solicitação do designer, sem repetir produção ou iniciar implementação por continuação automática da meta.

Atualizado em 11/11/2026. Este documento descreve o estado vigente; o histórico das decisões está em `C:/iox/CONTEXTO.md` e `C:/iox/BACKLOG.md`.

## Publicação atual

- Repositório: `C:/iox/sites/IOX-LPNEW`, branch `main`.
- Código publicado: `f09c03eb02cea33f38c26a08505e3f63592c36ae`.
- Cloudflare Pages, conta Frostty, projeto `iox-lpnew`.
- Deployment canônico conferido na publicação: `e5916cc1-ad4e-4156-b671-f6390676ea1d`.
- LP A: `/`. LP B: `/lp-b/`. P3: `/obrigado/`. P4: `/conversa/`.
- Publicação destinada à revisão; revisão estética/institucional continua com o designer e o cliente. Não encerrar a meta sem autorização.

## Escopo e limites confirmados

O designer aprovou o visual da seção Figma `211:2`, com uma identidade compartilhada para P3/P4: a da LP A. Pediu primeiro ligar os formulários atuais das LPs à P3 e depois implementar a P4. Ambas as etapas estão publicadas.

As LPs A e B mantêm o formulário em tela única. A P4 é uma página separada com quatro etapas. Não foi criada distribuição automática de experimento nem foram trocados os CTAs das LPs para a P4. A escolha de como executar o teste é uma configuração posterior.

ActiveCampaign, Meta, registro de abandono, CRM, entrega real dos contatos e agenda real continuam desconectados por decisão expressa do designer. Os dados preenchidos ficam apenas na memória/DOM durante a visita. Não há POST, dados pessoais em URL, storage ou logs do formulário. A condição de simulação é explicada pelo Léo na apresentação, sem avisos internos na UI, conforme pedido do designer.

## Formulários: regra compartilhada

| Campo | Opções/comportamento |
|---|---|
| Nome | Texto com validação |
| E-mail | Formato de e-mail válido |
| Celular (WhatsApp) | Número com DDD, de 10 a 15 dígitos |
| Quanto você tem investido hoje? | Até R$ 300 mil; de R$ 300 mil a R$ 1 milhão; de R$ 1 milhão a R$ 5 milhões; acima de R$ 5 milhões |
| Onde você já investe? | Renda Fixa; Renda Variável; Crédito Estruturado; Imóveis; Criptos; Ainda não invisto |
| Pretende investir nos próximos 30 dias? | Sim; Estou avaliando |
| Qual o melhor horário para falarmos? | Manhã; Tarde; Noite |

Onde investe permite múltiplas classes nas três apresentações. Marcar Ainda não invisto desmarca as demais; marcar uma classe desmarca Ainda não invisto. A normalização compartilhada está em `src/investment-selection.mjs`.

A LP A preserva o dropdown e seu visual inicial. O painel aberto indica as opções selecionadas e permanece aberto para marcar várias. Escape, Tab, clique fora ou o botão do campo fecham a lista. A LP B mantém seus checkboxes dentro do dropdown. A P4 apresenta as opções diretamente na etapa 2. Não alterar o Figma para acompanhar essa correção funcional.

## P4 — quatro etapas

Rota: `/conversa/`. Use `/conversa/?origem=b` quando o retorno deve ser para a LP B. Origem ausente ou desconhecida retorna à A.

1. Quanto você tem investido hoje?
2. Onde você já investe? Seleção múltipla.
3. Pretende investir nos próximos 30 dias?
4. Para quem o especialista deve ligar? Nome, e-mail, celular e melhor horário na mesma tela.

Progresso visível: 25%, 50%, 75%, 100%. Inicia sem respostas marcadas. Voltar mantém as respostas durante a visita. Não há persistência após recarregar a página. Enter continua o fluxo; validação aponta o primeiro campo pendente. Envio válido abre a P3 com a origem correspondente.

Botão final aprovado: Quero minha conversa. Abaixo dele permanece o consentimento e o link oficial da Política de Privacidade. Sem bibliotecas adicionais; fieldsets, labels, radio/checkbox nativos, erros associados e foco de teclado preservados.

Fontes Figma: desktop `211:3`, `211:54`, `211:123`, `211:164`; mobile `211:30`, `211:90`, `211:145`, `211:199`. Desktop 1440×960; mobile 393×852, com contato em 393×1010. Entrelinha mínima de 135%.

## P3 — obrigado e escolha de horário

Fontes Figma: desktop `211:231`, mobile `211:243`. Usa fontes e monograma do CDN próprio já existente.

Formulários válidos das LPs A/B e da P4 abrem `/obrigado/?origem=a` ou `origem=b`. O aviso antigo de indisponibilidade foi removido.

Copy principal aprovada:

- Recebemos seus dados.
- Um especialista do Grupo IOX vai falar com você em breve, pelo WhatsApp ou por telefone. Se preferir, escolha agora o melhor horário para a conversa.
- Escolher horário.
- Enquanto isso, conheça a lâmina do Fundo IOX 90.

Escolher horário abre um diálogo na própria P3. Oferece os próximos cinco dias úteis e sete horários em Brasília. Não existe página P5, provedor de agenda ou reserva real nesta fase.

Ao confirmar, o calendário desaparece e entra o estado solicitado pelo designer: check animado, Obrigado! e Seu agendamento ficou marcado para [data/hora escolhidas]. A animação respeita `prefers-reduced-motion`.

**Concluir volta à LP de origem:** A em `/`, B em `/lp-b/`. Origem desconhecida volta à A; não são aceitas URLs externas. X, Escape ou clique fora apenas fecham o modal e restauram o foco na P3. Reabrir a seleção mantém o horário na memória da visita.

A altura da P3 acompanha a área disponível do navegador. Foi conferida sem rolagem vertical indevida em desktop, incluindo 1920×1080, 1920×917, 1920×852 e 1366×768. O diálogo mantém rolagem própria quando necessária em telas menores; não esconder problemas com overflow global.

## Lâmina e privacidade

A P3 aponta para a lâmina real disponível no site oficial:
`https://grupoiox.com.br/wp-content/uploads/2025/12/IOX-90-Lamina-Agosto-2026.pdf`.

É de agosto de 2026, anterior aos períodos dos números aprovados nas LPs. Não inventar uma URL de setembro/outubro nem atualizar números com base no arquivo antigo. A lâmina mais recente não foi localizada nas buscas locais ou no Dropbox. Substituir quando houver o arquivo oficial correspondente.

Política usada na P4: `https://grupoiox.com.br/politica-de-privacidade/`.

## Arquivos e continuidade técnica

- P3: `scripts/render-confirmation.mjs`, `scripts/build-confirmation.mjs`, `src/conversation/thanks.mjs`, `styles.css`, `agenda.mjs`, `agenda-model.mjs`.
- P4: `scripts/render-quiz.mjs`, `scripts/build-quiz.mjs`, `src/conversation/quiz.mjs`, `quiz.css`, `model.mjs`, `content.mjs`.
- Retorno restrito às LPs: `src/confirmation.mjs`.
- Seleção compartilhada: `src/investment-selection.mjs`, `src/select.mjs`, `src/lp-b/main.mjs`.
- Build estático existente preservado. URLs dos módulos e estilos versionadas, incluindo dependências compartilhadas, para evitar mistura de cache.
- Assets continuam no R2/CDN próprio. Nenhuma nova foto foi gerada para P3/P4.
- Não usar mouse/teclado nem MCP oficial do Figma. O plugin Talk to Figma, a ponte 3055 e a prévia 4184 devem ser preservados conforme pedido do designer.

## Evidências verificadas na publicação

- Build e 22 testes passaram.
- P4: 52 combinações de largura/etapa, dois fluxos completos, teclado, toque real, retorno sem perda e validação.
- P3: 13 larguras e quatro fluxos dos formulários A/B em 393/1440.
- Agenda: nove viewports, troca calendário/confirmação, animação e movimento reduzido.
- Paridade A/B: nove larguras, múltiplas classes, Ainda não invisto exclusivo, limpeza e cinco classes simultâneas.
- Visual vazio da A: capturas byte-idênticas à versão anterior em 393/1440/1920. Painel aberto também conferido visualmente.
- Concluir: retorno público testado para A, B e origem desconhecida.
- Regressão da B em 13 larguras e da A em sete, preservando gráfico, toque, menu, FAQ, fontes e cores.
- Sem erro JavaScript, overflow de página, POST ou armazenamento de dados pessoais nos cenários verificados.

Evidências e scripts: `C:/iox/work/formulario-p3-p4-2026-11-11/`, `C:/iox/work/lp-b-web-2026-11-11/` e `C:/iox/work/lps-2026-11-10/verde-touch/`.

## Próximo passo

Aguardar o retorno do designer sobre a versão publicada e aplicar os ajustes que ele indicar. A implementação e as verificações não representam aprovação estética ou institucional. A revisão humana e uma lâmina mais recente continuam pendentes. Não conectar integrações, redesenhar telas, repetir perguntas de aprovação ou encerrar a meta/plugin por conta própria.


### Setas de retorno e check final — 11/11/2026

Pedido do designer: replicar nas vinte telas o retorno superior da tela 06 desktop, com ícone real antes do texto e alinhamento à direita. Exemplo 224:1109/ícone 224:1479 preservado; 19 controles ajustados. Desktop mantém fonte 16 e geometria da referência; mobile mantém PJ Light 14, ícone 24 e margem direita 24. Rodapé Voltar preservado conforme o exemplo. Canal atual do Talk: vwnzr1yu. Plugin foi fechado pelo usuário e reaberto por ele; assistente não o operou nem reiniciou a ponte.

Checks inseridos pelo designer preservados: desktop 224:1483/Vector 224:1484 e mobile Vector direto 224:1488. No mobile, título alinhado ao ícone em x78,y234,w291,h37. get_node_info omite VECTOR: usar scan_nodes_by_types antes de supor ausência. Adaptações duplicadas criadas pelo assistente foram removidas; apenas o ícone original ficou. Root conferiu retornos desktop/mobile e check final; 20 controles dentro dos frames e 96 comparações da copy sem faltas. Evidências em work/jornada-iox90-v2-2026-11-11/: antes-setas-check.json, depois-setas-check.json, setas-alteradas.json, qa-setas.json, qa-copy-apos-setas-check.json e manifesto atualizado.

Animação solicitada para o site: ao entrar na tela 9, círculo aparece suavemente e o traço do check é desenhado uma vez, sem loop; movimento reduzido apresenta estado final imediatamente. É requisito registrado, ainda não implementado: Figma segue estático, sem protótipo animado. Site/código continuam f09c03e; nenhuma integração ou publicação nova. O designer respondeu à pergunta sobre implementação pedindo ajustes no Figma, sem autorizar código ainda. Aguardar revisão sem repetir cobranças de aprovação. Meta, plugin, ponte e prévia mantidos. Builder inicial é histórico; sempre ler Figma vivo antes de nova alteração.
