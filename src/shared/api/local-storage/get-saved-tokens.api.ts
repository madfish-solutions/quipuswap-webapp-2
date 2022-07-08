import { SAVED_TOKENS_KEY } from '@config/localstorage';
import { SupportedNetworks, TokenWithQSNetworkType } from '@shared/types';

interface RawTokenWithQSNetworkType extends Omit<TokenWithQSNetworkType, 'fa2TokenId' | 'isWhitelisted'> {
  fa2TokenId?: string;
  isWhitelisted?: Nullable<boolean>;
}

export const getSavedTokensApi = (networkId?: SupportedNetworks) => {
  const allRawTokens: Array<RawTokenWithQSNetworkType> = JSON.parse(
    window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]'
  );

  const allTokens: TokenWithQSNetworkType[] = allRawTokens.map(({ fa2TokenId, ...restProps }) => ({
    ...restProps,
    fa2TokenId: fa2TokenId === undefined ? undefined : Number(fa2TokenId),
    isWhitelisted: null
  }));

  return networkId
    ? allTokens.filter(({ network: tokenNetwork }) => !tokenNetwork || tokenNetwork === networkId)
    : allTokens;
};
