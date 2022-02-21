import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from './root.store';

interface InfoMessage {
  type: 'info';
  message: string;
}

interface SuccessMessage {
  type: 'success';
  message: string;
}

interface ErrorMessage {
  type: 'error';
  message: string | Error;
}

type Message = InfoMessage | SuccessMessage | ErrorMessage;

export class NotificationsStore {
  message: Nullable<Message> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      message: observable,
      error: action,
      success: action,
      info: action,
      clear: action
    });
  }

  error(error: Error | string) {
    this.message = {
      type: 'error',
      message: error
    };
  }

  success(message: string) {
    this.message = {
      type: 'success',
      message
    };
  }

  info(message: string) {
    this.message = {
      type: 'info',
      message
    };
  }

  clear() {
    this.message = null;
  }
}
