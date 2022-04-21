import amplitude, { AmplitudeClient } from 'amplitude-js';

import { AMPLITUDE_API_KEY } from '@config/enviroment';

import { hash } from '../helpers';
import { Nullable, Optional } from '../types';
import { isLoading } from './is-logging';

export class AmplitudeService {
  instance: Nullable<AmplitudeClient> = null;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  props: { [key: string]: any } = {};

  constructor(API_KEY: Optional<string>) {
    if (API_KEY) {
      this.instance = amplitude.getInstance();
      this.instance.init(API_KEY);
    }
  }

  setUserId(userId: Nullable<string>) {
    this.instance?.setUserId(userId);
    if (isLoading()) {
      // eslint-disable-next-line no-console
      console.log('\x1b[36m%s\x1b[0m', 'userId', userId);
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  setProps(key: string, value: any) {
    this.props[key] = value;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  logEvent(action: string, payload: { [key: string]: any } = {}) {
    this.instance?.logEvent(action, { ...this.props, ...payload });
    if (isLoading()) {
      // eslint-disable-next-line no-console
      console.log('\x1b[36m%s\x1b[0m', action, { ...this.props, ...payload });
    }
  }
}

export const amplitudeService = new AmplitudeService(AMPLITUDE_API_KEY);

amplitudeService.setProps('session_id', hash(`${new Date().getTime()}`));
