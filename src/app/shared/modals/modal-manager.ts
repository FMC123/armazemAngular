export class ModalManager {
  opened: boolean = false;
  value: any;

  open(value) {
    this.opened = true;
    this.value = value;
  }

  close() {
    this.opened = false;
    this.value = null;
  }
}
