import { FA12Token, FA2Token, TezToken, TokensValue } from '../types';

export const isTezTokenTokensValue = (value: TokensValue): value is TezToken => 'tez' in value;
export const isFa12TokenTokensValue = (value: TokensValue): value is FA12Token => 'fa12' in value;
export const isFa2TokenTokensValue = (value: TokensValue): value is FA2Token => 'fa2' in value;
