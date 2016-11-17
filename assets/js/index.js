import { el, list, mount } from 'redom';

const hello = el('h1', 'Hello world!');

mount(document.body, hello);

class Td {
  constructor () {
    this.el = el('td');
  }
  update (data) {
    this.el.textContent = data;
  }
}

const Tr = list.extend('tr', Td);
const Table = list.extend('table', Tr);

const table = new Table();

mount(document.body, table);

table.update([
  [ 1, 2, 3 ],
  [ 4, 5, 6 ],
  [ 7, 8, 9 ]
]);
