import { el, text } from 'redom';

export class Hello {
  constructor () {
    this.el = el('h1',
      'Hello ',
      this.subject = text('RE:DOM'),
      '!'
    );
  }
  update (data) {
    const { subject } = data;

    this.subject.textContent = subject || 'RE:DOM';

    this.data = data;
  }
}
