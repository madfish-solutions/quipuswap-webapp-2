import { Nullable } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from './RootStore';

export class AuthStore {
  accountPkh: Nullable<string> = null;

  constructor(private root: RootStore) {
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
