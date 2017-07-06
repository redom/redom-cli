import { el } from 'redom';
import { dispatch } from './dispatch';
import { Hello } from './hello';

export class App {
  constructor () {
    this.el = el('.app',
      this.hello = new Hello(),
      this.input = el('input', {
        autofocus: true,
        oninput: e => dispatch(this, 'hello', this.input.value),
        placeholder: 'RE:DOM'
      })
    );
    this.data = {};
  }
  update (data) {
    const { hello } = data;

    this.hello.update(hello);

    this.data = data;
  }
}
