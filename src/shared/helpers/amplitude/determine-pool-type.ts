import { isTezosToken } from '@shared/helpers';
import { Token } from '@shared/types';

export enum TwoAssetsDexPoolType {
  TEZ_TOKEN = 'TezosToToken',
  TOKEN_TOKEN = 'TokenToToken'
}

export const determineTwoAssetsDexPoolTypeAmplitude = (tokens: Array<Token>) => {
  const isTezosTokenPool = tokens.some(isTezosToken);

  return isTezosTokenPool ? TwoAssetsDexPoolType.TEZ_TOKEN : TwoAssetsDexPoolType.TOKEN_TOKEN;
};
