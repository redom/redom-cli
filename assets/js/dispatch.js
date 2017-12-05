export const dispatch = (target, type, data) => {
  const event = new window.CustomEvent('redom', {
    bubbles: true,
    detail: {
      type, data
    }
  });
  const el = target.el || target;

  el.dispatchEvent(event);
};

export const listen = (target, handlers) => {
  const el = target.el || target;

  const handler = e => {
    const { type, data } = e.detail;

    handlers[type] && handlers[type](data);
  };

  el.addEventListener('redom', handler);

  return {
    destroy () {
      el.removeEventListener('redom', handler);
    }
  };
};
