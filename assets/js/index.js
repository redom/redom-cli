import { el, text, mount } from 'redom';

class App {
  constructor () {
    this.el = el('.app',
      this.hello = new Hello(),
      this.input = el('input', {
        autofocus: true,
        placeholder: 'RE:DOM',
        oninput: e => this.hello.update(this.input.value)
      })
    );
  }
}

class Hello {
  constructor () {
    this.el = el('h1',
      'Hello ',
      this.subject = text('RE:DOM'),
      '!'
    );
  }
  update (subject) {
    this.subject.textContent = subject || 'RE:DOM';
  }
}

const app = new App();

mount(document.body, app);
