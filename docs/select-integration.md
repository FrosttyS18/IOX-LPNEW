# Selects do formulário

O módulo `src/select.mjs` promove os selects simples existentes. Não altera opções, valores, nomes, copy do formulário ou comportamento de envio. O select nativo permanece disponível no HTML sem JavaScript. O módulo não inclui CSS, bibliotecas ou envio de dados.

## Integração

```js
import {upgradeSelects} from './select.mjs';

const form = document.querySelector('#specialist-form');
const selects = upgradeSelects(form);

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!selects.reportValidity()) return;
  if (!form.reportValidity()) return;
});
```

Acrescentar a chamada ao listener existente, preservando a mensagem de envio indisponível e demais validações. O build deve copiar `select.mjs` para `dist/select.mjs`, ao lado de `main.mjs`.

`upgradeSelects(form)` é idempotente para o mesmo formulário e retorna `{reportValidity()}`. A validação devolve booleano, apresenta os erros dos selects obrigatórios vazios e foca o primeiro. A validação HTML nativa continua responsável pelos demais inputs. O módulo guarda a obrigatoriedade original, aplica `required=false` e `hidden=true` ao select apenas depois de criar seu controle. Não chamar `setCustomValidity` no select oculto.

O módulo atende aos quatro selects simples, estáticos e habilitados deste formulário. Alteração dinâmica de opções, múltipla seleção e remontagem/destruição do formulário não fazem parte deste contrato. Valores de `FormData` continuam vindo dos selects originais. Cada alteração confirmada dispara `input` e `change` com bubbling. O reset do formulário sincroniza os controles depois do reset nativo.

## DOM e estilos

Todos os elementos internos, exceto o botão, são `span`, mantendo a estrutura válida dentro do `span.select-shell` existente.

| Classe/estado | Função e tratamento esperado |
| --- | --- |
| `.custom-select` | Wrapper, `display:block;position:relative` |
| `.custom-select__trigger` | Botão com `role=combobox`, largura total, altura de 56px, fundo branco, texto escuro, borda discreta e espaço para seta à direita |
| `.custom-select__value` | Texto selecionado ou placeholder original |
| `.custom-select__arrow` | Seta decorativa vazia com `aria-hidden=true`; desenhar por CSS |
| `.custom-select__list` | `role=listbox`, menu absoluto branco, z-index suficiente, largura total, altura máxima e rolagem vertical |
| `.custom-select[data-placement=above] .custom-select__list` | Abrir acima com `bottom:calc(100% + 8px);top:auto` |
| `.custom-select[data-placement=below] .custom-select__list` | Abrir abaixo com `top:calc(100% + 8px);bottom:auto` |
| `.custom-select__option` | `role=option`, `display:block`, altura mínima de 44px, padding e texto escuro |
| `.custom-select__option[aria-selected=true]` | Seleção confirmada, dourado leve |
| `.custom-select__option[data-active=true]` | Opção em navegação/hover, superfície cinza suave; distinta da seleção confirmada |
| `.custom-select__trigger[aria-invalid=true]` | Estado de erro discreto e identificável |
| `.custom-select__error` | Mensagem legível abaixo do campo, `display:block`, `role=alert` |
| `.custom-select[data-open=true]` | Menu aberto |
| `.custom-select[data-placeholder=true] .custom-select__value` | Cor discreta do placeholder |

Manter `[hidden]{display:none!important}`. Desabilitar o chevron legado de `.select-shell::after` quando o shell contiver `.custom-select`, evitando duas setas. Nenhum estilo inline é aplicado pelo módulo.

O foco depende da modalidade já gerenciada pela página: mostrar indicação visível para teclado e preservar a ausência de ring/borda dourada no clique de mouse. Não apagar a indicação de teclado. As opções não recebem foco DOM; a navegação permanece no botão e a opção ativa é indicada por `aria-activedescendant`.

## Interação

- Enter/Espaço: abre; quando aberto, confirma a opção ativa e fecha.
- Seta para baixo/cima: abre; se aberto, navega sem alterar o valor confirmado.
- Home/End: abre e vai para a primeira/última opção.
- Escape: fecha preservando o valor confirmado.
- Tab/Shift+Tab: confirma o ativo, fecha e mantém o fluxo normal de foco.
- Letras: busca incremental de 700ms, ignora acentos, cicla caracteres repetidos.
- Clique em opção: confirma, atualiza o select original e fecha.
- Clique fora: fecha sem confirmar um hover/navegação pendente.
- Blur sem clique externo: confirma a opção ativa e fecha.

O botão preserva o rótulo do campo por `aria-labelledby`, mantém `aria-expanded`, `aria-controls` e `aria-required`. O label original passa a apontar para o botão após o upgrade. As opções refletem a seleção em `aria-selected`. Erros adicionam `aria-invalid`, `aria-errormessage` e `aria-describedby` sem eliminar descrições anteriores.

## Verificação

Teste isolado em Chrome headless 156: fallback nativo, transferência de required, erro e foco, setas/Home/End/Enter/Espaço/Escape, typeahead, clique, Tab/Shift+Tab, clique externo sem mudança acidental, FormData, eventos, idempotência e reset. Arquivos de evidência fora do projeto:

- `C:/iox/work/lps-2026-11-10/qa-web-codigo/select-interaction-test.mjs`
- `C:/iox/work/lps-2026-11-10/qa-web-codigo/select-interaction-result.json`

Referência de comportamento: [W3C APG — Select-Only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/). A leitura real com tecnologias assistivas e o resultado visual integrado ainda dependem de revisão. Este teste não constitui aprovação estética.
