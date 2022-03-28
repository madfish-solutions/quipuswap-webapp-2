import { action, makeObservable, observable } from 'mobx';

import { Nullable } from '../types/types';
import { RootStore } from './root.store';

export class AuthStore {
  accountPkh: Nullable<string> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      accountPkh: observable,
      setAccountPkh: action
    });
  }

  // We can use only this setter without hook useAuthStore only after fully migrate context to store
  setAccountPkh(accountPkh: Nullable<string>) {
    this.accountPkh = accountPkh;
  }
}
