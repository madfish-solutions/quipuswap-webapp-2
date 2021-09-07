import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export const mutezToTz = (mutez: any, Tezos: TezosToolkit) : BigNumber => Tezos.format('mutez', 'tz', mutez) as any;
