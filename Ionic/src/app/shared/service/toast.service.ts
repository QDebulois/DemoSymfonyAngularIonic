import { computed, Injectable, signal } from '@angular/core';

export type State = {
  toastIsOpen: boolean;
  toastDuration: number;
  toastMessage: string;
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  state = signal<State>({
    toastIsOpen: false,
    toastDuration: 2500,
    toastMessage: 'This toast will close in 2.5 seconds',
  })

  toastIsOpen = computed(() => this.state().toastIsOpen)
  toastDuration = computed(() => this.state().toastDuration)
  toastMessage = computed(() => this.state().toastMessage)

  constructor() {}

  setOpen(isOpen: boolean) {
    this.state.update(s => ({ ...s, toastIsOpen: isOpen }));

    return this;
  }

  setMessage(message: string) {
    this.state.update(s => ({ ...s, toastMessage: message }));

    return this;
  }

  setDuration(duration: number) {
    this.state.update(s => ({ ...s, toastDuration: duration }));

    return this;
  }
}
