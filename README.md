# IOX — LP A

Implementação da LP A a partir do layout atual do Figma, com HTML semântico, CSS responsivo e JavaScript nativo. As imagens e os quatro pesos da Plus Jakarta Sans são servidos pelo CDN R2 existente, com endereços centralizados em `src/assets.json`.

## Desenvolvimento

Requer Node.js. O projeto não tem dependências de execução.

```powershell
npm run build
$env:PORT = 4184
npm run dev
```

A prévia fica em `http://127.0.0.1:4184`. O servidor lê a pasta `dist`; execute o build depois de alterar os arquivos.

```powershell
npm test
node scripts/package-deployment.mjs
node scripts/package-worker.mjs
```

Esses comandos preparam o manifesto de arquivos e um Worker com o HTML, CSS e JavaScript da página em `output/deployment`. Eles não publicam a página nem contêm credenciais. As imagens e fontes continuam no R2; não são incluídas no pacote da página.

## Arquivos principais

- `src/content.json`: copy do briefing, oito seções e cinco variações de hero mais a versão padrão.
- `scripts/render.mjs`: estrutura semântica e conteúdo inicial acessível sem depender de renderização no navegador.
- `src/styles.css`: composição, tipografia e comportamento responsivo.
- `src/main.mjs` e `src/hero.mjs`: navegação, modalidade de foco, formulário e seleção do hero pelo `utm_content`.
- `src/select.mjs`: dropdowns com navegação por teclado e valores sincronizados aos campos do formulário.
- `src/essentials.mjs`: controles de expansão dos tópicos do fundo no mobile, com Resgate aberto inicialmente; desktop e versão sem JavaScript mostram todo o conteúdo.
- `src/navigation.mjs`: menu lateral mobile, com fechamento pelo botão, fundo ou Escape e foco contido no painel.
- `src/reveal.mjs` e `src/counters.mjs`: entradas ao rolar e contadores visuais, respeitando a preferência por movimento reduzido.
- `src/assets.json`: endereços dos arquivos no CDN.

## Estado da entrega

A prévia atual para revisão está em https://iox-lpnew.pages.dev/, no projeto Cloudflare Pages `iox-lpnew` da conta Frostty. A publicação de 10/11/2026 usa o bundle preparado em `output/deployment/worker.mjs`, enviado como `_worker.js` no modo avançado do Pages. O endereço antigo em `workers.dev` permanece na versão anterior. Não há domínio personalizado nem publicação automática por Git.

O formulário tem campos e validação, sem CRM, webhook ou envio de dados, conforme solicitado. Uma tentativa válida informa que o envio ainda não está disponível; não apresenta sucesso fictício.

Os retratos usados no estudo são personagens provisórios. A identificação dessa condição fica nesta documentação, sem acrescentar legenda ao layout. O texto legal integral fornecido pelo usuário está em `src/legal.json` e substitui a versão abreviada do briefing no rodapé, com fonte de 10 px. A URL da política de privacidade ainda precisa ser fornecida para a configuração final da captação.

O primeiro parágrafo legal permanece visível; os demais ficam em um controle nativo de “Ver mais” e “Ver menos”, utilizável por teclado e sem JavaScript. No mobile, o símbolo do bloco “O essencial do fundo” usa a imagem completa do CDN por meio de `picture`; o arquivo recortado do desktop é preservado.

O hero padrão usa no mobile a fotografia vertical fornecida pelo designer, com degradê preto aplicado em CSS e enquadramento próprio. O desktop e os cinco heroes de campanha mantêm suas fotografias. Os contadores mostram os valores finais no HTML e para leitores de tela; a animação visual ocorre uma vez quando cada número entra na área visível.

A versão de revisão usa `noindex,nofollow`. A validação técnica não representa aprovação estética ou institucional. O arquivo do Figma e a LP B não são alterados por este projeto.
