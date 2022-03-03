import { ColorModes } from '@quipuswap/ui-kit';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from './root.store';

export class UiStore {
  colorThemeMode: ColorModes = ColorModes.Dark;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      colorThemeMode: observable,
      setColorThemeMode: action
    });
  }

  // We can use only this setter without hook only after fully migrate context to store
  setColorThemeMode(colorThemeMode: ColorModes) {
    this.colorThemeMode = colorThemeMode;
  }
}
