import amplitude, { AmplitudeClient } from 'amplitude-js';

import { AMPLITUDE_API_KEY } from '@config/enviroment';

import { hash } from '../helpers';
import { Nullable, Optional } from '../types';
import { Console } from './console';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class AmplitudeService {
  private readonly instance: Nullable<AmplitudeClient> = null;
  private userProps: Record<string, any> = {};

  constructor(API_KEY: Optional<string>) {
    if (API_KEY) {
      this.instance = amplitude.getInstance();
      this.instance.init(API_KEY);
      Console.info('Amplitude.init', API_KEY);
    }
  }

  setUserId(userId: Nullable<string>) {
    this.instance?.setUserId(userId);
    Console.info('Amplitude.userId', userId);
  }

  setUserProps(key: string, value: any) {
    // TODO: store user props in Identify object
    this.userProps[key] = value;
    Console.info('Amplitude.setUserProps.key', value);
  }

  logEvent(action: string, payload: { [key: string]: any } = {}) {
    const payloadWithUserProps = {
      ...payload,
      userProps: this.userProps
    };
    this.instance?.logEvent(action, payloadWithUserProps);
    Console.info(`Amplitude.${action}`, payloadWithUserProps);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const amplitudeService = new AmplitudeService(AMPLITUDE_API_KEY);

const sessionId = hash(`${new Date().getTime()}`);
amplitudeService.setUserProps('session_id', sessionId);
Console.info('Amplitude.sessionId', sessionId);
