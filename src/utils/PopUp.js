import { toParams, toQuery } from './urlUtils';

class PopupWindow {
  constructor(id, url, options = {}) {
    this.id = id;
    this.url = url;
    this.options = options;
  }

  open() {
    const { url, id, options } = this;

    if (window.screen.height > options.height) {
      options.top = (window.screen.height - options.height) / 2;
    } else {
      options.height = window.screen.height;
    }

    if (window.screen.width > options.width) {
      options.left = (window.screen.width - options.width) / 2;
    } else {
      options.width = window.screen.width;
    }

    this.window = window.open(url, id, toQuery(options, ','));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this.iid = window.setInterval(() => {
        try {
          const popup = this.window;

          if (!popup || popup.closed !== false) {
            this.close();

            reject(new Error('The popup was closed'));

            return;
          }

          if (popup.location.href === this.url || popup.location.pathname === 'blank') {
            return;
          }

          let typeAuthorization = 'code';
          if (popup.location.hash) {
            typeAuthorization = 'token';
          }

          let params = {};
          if (typeAuthorization === 'token') {
            params = toParams(popup.location.hash.replace(/^#/, ''));
          } else {
            params.code = popup.location.href.split('?')[1].replace('code=', '');
          }

          resolve(params);

          this.close();
        } catch (error) {
          /*
           * Ignore DOMException: Blocked a frame with origin from accessing a
           * cross-origin frame.
           */
        }
      }, 500);
    });
  }

  cancel() {
    if (this.iid) {
      window.clearInterval(this.iid);
      this.iid = null;
    }
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.then(...args);
  }

  static open(...args) {
    const popup = new this(...args);

    popup.open();
    popup.poll();

    return popup;
  }
}

export default PopupWindow;