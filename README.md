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
- `src/assets.json`: endereços dos arquivos no CDN.

## Estado da entrega

O formulário tem campos e validação, sem CRM, webhook ou envio de dados, conforme solicitado. Uma tentativa válida informa que o envio ainda não está disponível; não apresenta sucesso fictício.

Os retratos usados no estudo são personagens provisórios. A identificação dessa condição fica nesta documentação, sem acrescentar legenda ao layout. O texto legal integral fornecido pelo usuário está em `src/legal.json` e substitui a versão abreviada do briefing no rodapé, com fonte de 10 px. A URL da política de privacidade ainda precisa ser fornecida para a configuração final da captação.

A versão de revisão usa `noindex,nofollow`. A validação técnica não representa aprovação estética ou institucional. O arquivo do Figma e a LP B não são alterados por este projeto.
