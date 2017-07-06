import { mount } from 'redom';
import { App } from './app';
import { api } from './api';

const app = new App();

api(app);

mount(document.body, app);
