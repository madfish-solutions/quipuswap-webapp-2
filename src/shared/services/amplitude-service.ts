import amplitude, { AmplitudeClient } from 'amplitude-js';

import { AMPLITUDE_API_KEY } from '@config/enviroment';

import { cyrb53 } from '../helpers';
import { Nullable } from '../types';

export class AmplitudeService {
  instance: AmplitudeClient;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  props: { [key: string]: any } = {};

  constructor(API_KEY: string) {
    amplitude.getInstance().init(API_KEY);
    this.instance = amplitude.getInstance();
  }

  setUserId(userId: Nullable<string>) {
    this.instance.setUserId(userId);
    // eslint-disable-next-line no-console
    console.log('\x1b[36m%s\x1b[0m', 'userId', userId);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  setProps(key: string, value: any) {
    this.props[key] = value;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  logEvent(action: string, payload: { [key: string]: any } = {}) {
    this.instance.logEvent(action, payload);
    // eslint-disable-next-line no-console
    console.log('\x1b[36m%s\x1b[0m', action, { ...this.props, ...payload });
  }
}

export const amplitudeService = new AmplitudeService(AMPLITUDE_API_KEY);

amplitudeService.setProps('session_id', cyrb53(`${new Date().getTime()}`));
