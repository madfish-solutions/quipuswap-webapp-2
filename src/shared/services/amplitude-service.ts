import amplitude from 'amplitude-js';

import { AMPLITUDE_API_KEY } from '@config/enviroment';

import { hash, isDev } from '../helpers';
import { Nullable, Optional } from '../types';
import { Console } from './console';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class AmplitudeService {
  static _instance: AmplitudeService;

  private userProps: Record<string, any> = {};

  constructor(API_KEY: Optional<string>) {
    if (AmplitudeService._instance) {
      return AmplitudeService._instance;
    }

    if (API_KEY) {
      amplitude.getInstance().init(API_KEY);
      Console.info('Amplitude.init', API_KEY);
    }

    AmplitudeService._instance = this;
  }

  setUserId(userId: Nullable<string>) {
    Console.info('Amplitude.userId', userId);

    if (isDev()) {
      return;
    }

    amplitude.getInstance().setUserId(userId);
  }

  setUserProps(key: string, value: any) {
    this.userProps[key] = value;
    Console.info(`Amplitude.setUserProps[${key}]`, value);

    if (isDev()) {
      return;
    }

    const identify = new amplitude.Identify().set(key, value);
    amplitude.getInstance().identify(identify);
  }

  logEvent(action: string, payload: { [key: string]: any } = {}) {
    const payloadWithUserProps = {
      ...payload,
      userProps: this.userProps
    };
    Console.info(`Amplitude.${action}`, payloadWithUserProps);

    if (isDev()) {
      return;
    }

    amplitude.getInstance().logEvent(action, payloadWithUserProps);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const amplitudeService = new AmplitudeService(AMPLITUDE_API_KEY);

const sessionId = hash(`${new Date().getTime()}`);
amplitudeService.setUserProps('session_id', sessionId);
Console.info('Amplitude.sessionId', sessionId);
