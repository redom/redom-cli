export class Store {
  constructor () {
    this.data = {};
  }
  get (path) {
    if (!path) {
      return this.data;
    }

    const split = path.split('.');
    let target = this.data;

    for (let i = 0; i < split.length; i++) {
      const part = split[i];

      if (path in target) {
        target = target[part];
      } else {
        return target[part];
      }
    }

    return target;
  }
  set (path, value) {
    const split = path.split('.');
    let target = this.data;

    for (let i = 0; i < split.length; i++) {
      const part = split[i];

      if (i === split.length - 1) {
        target[part] = value;
      } else {
        target = target[part] = {
          ...target[part]
        };
      }
    }
  }
}
