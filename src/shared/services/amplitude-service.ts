import amplitude, { AmplitudeClient, Identify } from 'amplitude-js';

import { AMPLITUDE_API_KEY } from '@config/enviroment';

import { hash } from '../helpers';
import { Nullable, Optional } from '../types';
import { Console } from './console';

export class AmplitudeService {
  private readonly instance: Nullable<AmplitudeClient> = null;
  private readonly identify: Nullable<Identify> = null;

  constructor(API_KEY: Optional<string>) {
    if (API_KEY) {
      this.instance = amplitude.getInstance();
      this.instance.init(API_KEY);
      this.identify = new amplitude.Identify();
      Console.info('Amplitude.init', API_KEY);
    }
  }

  setUserId(userId: Nullable<string>) {
    this.instance?.setUserId(userId);
    Console.info('Amplitude.userId', userId);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  setUserProps(key: string, value: any) {
    this.identify?.set(key, value);
    Console.info('Amplitude.setUserProps.key', value);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  logEvent(action: string, payload: { [key: string]: any } = {}) {
    this.instance?.logEvent(action, payload);
    Console.info(`Amplitude.${action}`, payload);
  }
}

export const amplitudeService = new AmplitudeService(AMPLITUDE_API_KEY);

const sessionId = hash(`${new Date().getTime()}`);
amplitudeService.setUserProps('session_id', sessionId);
Console.info('Amplitude.sessionId', sessionId);
