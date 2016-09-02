import { el, mount } from 'redom';

const hello = el('h1', 'Hello world!');

mount(document.body, hello);
