export class Notification {

  static success(message: string) {
    if (PNotify.notices && PNotify.notices.some(n => n.options && n.options.text === message)) {
      return;
    }

    PNotify.prototype.options.styling = 'fontawesome';
    new PNotify({
      title: 'Sucesso',
      text: message,
      type: 'success',
      hide: true,
      delay: 8000,
      buttons: {
        closer: true,
        sticker: false
      }
    });
  }

  static notification(message: string) {
    if (PNotify.notices && PNotify.notices.some(n => n.options && n.options.text === message)) {
      return;
    }

    PNotify.prototype.options.styling = 'fontawesome';
    new PNotify({
      title: 'Atenção',
      text: message,
      type: 'warning',
      hide: false,
      buttons: {
        closer: true,
        sticker: false
      }
    });
  }

  static error(message: string) {
    if (PNotify.notices && PNotify.notices.some(n => n.options && n.options.text === message)) {
      return;
    }

    PNotify.prototype.options.styling = 'fontawesome';
    new PNotify({
      title: 'Erro',
      text: message,
      type: 'error',
      hide: false,
      buttons: {
        closer: true,
        sticker: false
      }
    });
  }

  static clearErrors() {
    PNotify.notices.forEach((notice) => {
      if (notice.remove && notice.options.type === 'error') {
        notice.remove(false);
      }
    });
  }

  static clear() {
    PNotify.removeAll();
  }
}