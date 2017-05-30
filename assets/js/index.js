import { css, el, text, mount } from 'redom';

css({
  body: {
    fontFamily: 'sans-serif'
  }
});

class App {
  constructor () {
    this.el = el('.app',
      this.hello = new Hello(),
      this.input = el('input', {
        autofocus: true,
        placeholder: 'RE:DOM'
      })
    );

    this.input.oninput = e => this.hello.update(this.input.value);
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
