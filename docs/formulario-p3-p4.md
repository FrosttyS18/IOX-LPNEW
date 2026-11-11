# P3 e P4 — continuidade de implementação

## Escopo aprovado em 11/11/2026

O designer aprovou os layouts da seção Figma211:2, identidade da LP A, e depois priorizou publicar a P3 e ligá-la aos formulários atuais das LPs A e B. A implementação da P4 vem depois. A e B continuam com seus formulários em tela única; nenhum experimento ou distribuição automática foi criado.

## P3 — obrigado

Fonte desktop211:231 e mobile211:243. HTML semântico em `/obrigado/`, com fontes e monograma do CDN existente. Os dois formulários validam normalmente e redirecionam para a mesma página, com `origem=a` ou `origem=b` para o retorno ao site. Não há POST, CRM, evento Meta, gravação de contato, dados pessoais em URL, storage ou logs. A confirmação é uma demonstração do fluxo aprovado, sem entrega real dos dados.

Pedido posterior do designer: simular a agenda para o botão ter ação. Escolher horário abre um diálogo na própria P3, com os próximos cinco dias úteis e sete horários, em Brasília. Seleção e resumo funcionam apenas na memória da visita, sem reserva, provedor externo ou nova P5. O designer explicitamente proibiu textos internos de demonstração na UI: a apresentação do Léo explica essa condição. A tela diz somente Horário selecionado, sem afirmar uma reserva confirmada. Escape, botão Fechar e clique fora retornam à P3 com foco no botão original.

A lâmina acessível no site oficial é `https://grupoiox.com.br/wp-content/uploads/2025/12/IOX-90-Lamina-Agosto-2026.pdf`. É de agosto de2026, anterior aos números usados nas LPs. Não trocar os dados das LPs com base nesse documento. A substituição por uma lâmina mais recente depende do arquivo oficial correspondente.

Código da P3: `src/confirmation.mjs`, `src/conversation/thanks.mjs`, `src/conversation/styles.css`, `src/conversation/content.mjs`, `scripts/render-confirmation.mjs`, `scripts/build-confirmation.mjs`. A agenda usa `agenda.mjs` e `agenda-model.mjs` no mesmo diretório.

## Validação da P3

Build e17testes passaram. Navegador real invisível:13larguras de320a1920px sem overflow ou texto cortado, fontes/imagens carregadas. Fluxos A e B conferidos em393e1440px: preenchimento inválido permanece no formulário; válido chega à P3; retorno identifica a LP; nenhum POST ou armazenamento. Root conferiu as capturas393e1440contra o layout aprovado. Regressão da B em13larguras e da A em7larguras, com gráfico, toque, menu, FAQ e controles preservados. Evidências em `C:/iox/work/formulario-p3-p4-2026-11-11/`.

## P4 — formulário em etapas implementado

Rota `/conversa/`, ou `/conversa/?origem=b` para retornar à B. Quatro telas: patrimônio investido, classes de investimento, intenção em30dias, identificação com nome/e-mail/WhatsApp/horário. Sem respostas selecionadas inicialmente, múltiplas classes e opção Ainda não invisto exclusiva. Respostas apenas na memória da visita, retorno sem perda durante o fluxo. Mesma P3 ao concluir. Sem ActiveCampaign, Meta ou rastreamento de abandono nesta fase. Os formulários embarcados A/B permanecem como estavam, apenas com retorno para P3; nenhuma distribuição de experimento foi criada.

Código da P4: `scripts/render-quiz.mjs`, `scripts/build-quiz.mjs`, `src/conversation/quiz.css`, `src/conversation/quiz.mjs` e `model.mjs`. Sem bibliotecas adicionais. Fieldsets, labels, controles nativos de radio/checkbox, erros associados, foco de teclado e título da etapa atual. Progresso25/50/75/100. Consentimento e link oficial da Política de Privacidade preservados. Enter continua o fluxo e o botão Voltar mantém respostas.

QA local:52combinações(13larguras×4etapas), sem overflow/corte/erroJS; fluxos completos A1440/B393 com validação, seleção múltipla, Ainda não invisto exclusivo e retorno sem perda. Nenhum POST/storage. Root comparou as8telas desktop/mobile às fontes211:3/30/54/90/123/145/164/199, refinando quebras e posições. Build20testes PASS.

## Agenda e altura da P3 — revisão posterior de11/11/2026

A altura mínima fixa foi substituída por limite relativo à área disponível do navegador. QA9viewports, incluindo1920×1080/917/852 e1366×768, sem rolagem vertical indevida emdesktop. A agenda preserva rolagem própria quando necessária emcelulares.19testes eQA13larguras/4fluxosA-Bpassaram;rootconferiuagenda393eP31920×917. NenhumPOST/storage/reserva real.

Pedido posterior: o calendário desaparece após confirmar e o mesmo diálogo passa ao estado de sucesso, com check animado, Obrigado! e Seu agendamento ficou marcado para [data/hora escolhidas]. Essa copy foi solicitada explicitamente para a apresentação simulada. A reserva continua sem integração real. A animação respeita prefers-reduced-motion; Concluir/Fechar/Escape fecham e restauram o foco. Reabrir mostra a seleção, mantendo o horário anterior na memória da visita. Nenhum texto interno de demonstração na UI.

## Publicação e conferência final — 11/11/2026

Implementação enviada ao origin/main no commit36d996fcb8c27b3e490795ed7e6d90f851f91fc2. Cloudflare Pages83469e2c-e2f9-4918-870d-24121e369ac7 com sucesso e canônico confirmado. P3em/obrigado/, P4em/conversa/. QA pública:52combinações de etapas/larguras,2fluxos completosP4,4fluxos dos formuláriosA/Bem393/1440 e9viewports daagenda. Nenhum erroJS,POST,storageouoverflow. Calendário some ao confirmar; check animado e data/hora conferidos no mobile público. Em1920×1080/917/852 aP3não gera rolagem vertical indevida. Nenhuma integração real conectada. LPs A/B e Figma preservados fora do retorno solicitado.
