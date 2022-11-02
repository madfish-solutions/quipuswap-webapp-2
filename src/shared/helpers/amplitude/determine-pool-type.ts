import { isTezosToken } from '@shared/helpers';
import { Token } from '@shared/types';

export enum PoolType {
  TEZ_TOKEN = 'TezosToToken',
  TOKEN_TOKEN = 'TokenToToken'
}

export const determinePoolTypeAmplitude = (tokens: Array<Token>) => {
  const isTezosTokenPool = tokens.some(isTezosToken);

  return isTezosTokenPool ? PoolType.TEZ_TOKEN : PoolType.TOKEN_TOKEN;
};
