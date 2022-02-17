import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { TokenDataType } from '@utils/types';

import { isTokenDataAddressTez } from './isTokenDataAddressTez';
import { toNat } from './toNat';

export const getValueForSDK = (token: TokenDataType, value: BigNumber, tezos: TezosToolkit) =>
  isTokenDataAddressTez(token) ? new BigNumber(tezos.format('tz', 'mutez', value)) : toNat(value, token.token.decimals);
