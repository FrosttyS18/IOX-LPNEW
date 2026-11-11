import {returnPath} from '../confirmation.mjs';

const source=new URLSearchParams(window.location.search).get('origem');
for(const link of document.querySelectorAll('[data-return]'))link.href=returnPath(source);
