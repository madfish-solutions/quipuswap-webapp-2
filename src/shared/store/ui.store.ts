import { action, makeObservable, observable } from 'mobx';

import { COOKIES_APPRROVAL_KEY } from '@config/localstorage';
import { ColorModes } from '@providers/color-theme-context';
import { noopMap } from '@shared/mapping';

import { RootStore } from './root.store';
import { LocalStorageModel } from './utils';

export class UiStore {
  colorThemeMode: ColorModes = ColorModes.Dark;
  cookieApprovalModel = new LocalStorageModel(COOKIES_APPRROVAL_KEY, false, noopMap);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      colorThemeMode: observable,
      cookieApprovalModel: observable,

      setColorThemeMode: action
    });
  }

  // We can use only this setter without hook only after fully migrate context to store
  setColorThemeMode(colorThemeMode: ColorModes) {
    this.colorThemeMode = colorThemeMode;
  }
}
