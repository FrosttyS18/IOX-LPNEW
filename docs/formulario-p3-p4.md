# P3 e P4 — continuidade de implementação

## Escopo aprovado em 11/11/2026

O designer aprovou os layouts da seção Figma211:2, identidade da LP A, e depois priorizou publicar a P3 e ligá-la aos formulários atuais das LPs A e B. A implementação da P4 vem depois. A e B continuam com seus formulários em tela única; nenhum experimento ou distribuição automática foi criado.

## P3 — obrigado

Fonte desktop211:231 e mobile211:243. HTML semântico em `/obrigado/`, com fontes e monograma do CDN existente. Os dois formulários validam normalmente e redirecionam para a mesma página, com `origem=a` ou `origem=b` para o retorno ao site. Não há POST, CRM, evento Meta, gravação de contato, dados pessoais em URL, storage ou logs. A confirmação é uma demonstração do fluxo aprovado, sem entrega real dos dados.

Pedido posterior do designer: simular a agenda para o botão ter ação. Escolher horário abre um diálogo na própria P3, com os próximos cinco dias úteis e sete horários, em Brasília. Seleção e resumo funcionam apenas na memória da visita, sem reserva, provedor externo ou nova P5. O designer explicitamente proibiu textos internos de demonstração na UI: a apresentação do Léo explica essa condição. A tela diz somente Horário selecionado, sem afirmar uma reserva confirmada. Escape, botão Fechar e clique fora retornam à P3 com foco no botão original.

A lâmina acessível no site oficial é `https://grupoiox.com.br/wp-content/uploads/2025/12/IOX-90-Lamina-Agosto-2026.pdf`. É de agosto de2026, anterior aos números usados nas LPs. Não trocar os dados das LPs com base nesse documento. A substituição por uma lâmina mais recente depende do arquivo oficial correspondente.

Código: `src/confirmation.mjs`, `src/conversation/thanks.mjs`, `src/conversation/styles.css`, `src/conversation/content.mjs`, `scripts/render-confirmation.mjs`, `scripts/build-confirmation.mjs`. Modelo e testes da P4 preparados, ainda sem tela funcional nesta entrega.

## Validação da P3

Build e17testes passaram. Navegador real invisível:13larguras de320a1920px sem overflow ou texto cortado, fontes/imagens carregadas. Fluxos A e B conferidos em393e1440px: preenchimento inválido permanece no formulário; válido chega à P3; retorno identifica a LP; nenhum POST ou armazenamento. Root conferiu as capturas393e1440contra o layout aprovado. Regressão da B em13larguras e da A em7larguras, com gráfico, toque, menu, FAQ e controles preservados. Evidências em `C:/iox/work/formulario-p3-p4-2026-11-11/`.

## P4 — próxima etapa

Quatro telas: patrimônio investido, classes de investimento, intenção em30dias, identificação com nome/e-mail/WhatsApp/horário. Sem respostas selecionadas inicialmente, múltiplas classes e opção Ainda não invisto exclusiva. Respostas apenas na memória da visita, retorno sem perda durante o fluxo. Mesma P3 ao concluir. Sem ActiveCampaign, Meta, rastreamento de abandono ou agenda nesta fase. Não substituir os formulários embarcados nem escolher o teste por conta própria.

## Agenda e altura da P3 — revisão posterior de11/11/2026

A altura mínima fixa foi substituída por limite relativo à área disponível do navegador. QA9viewports, incluindo1920×1080/917/852 e1366×768, sem rolagem vertical indevida emdesktop. A agenda preserva rolagem própria quando necessária emcelulares.19testes eQA13larguras/4fluxosA-Bpassaram;rootconferiuagenda393eP31920×917. NenhumPOST/storage/reserva real.
