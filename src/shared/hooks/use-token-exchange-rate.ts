import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE_BN } from '@config/constants';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

export const useTokenExchangeRate = () => {
  const exchangeRates = useNewExchangeRates();

  const getTokenExchangeRate = (token: Nullable<Token>) => {
    if (isNull(token) || !IS_NETWORK_MAINNET) {
      return TESTNET_EXCHANGE_RATE_BN;
    }

    const { contractAddress, fa2TokenId } = token;
    const tokenSlug = getTokenSlug({
      contractAddress: contractAddress,
      fa2TokenId: fa2TokenId
    });

    return exchangeRates[tokenSlug];
  };

  return { getTokenExchangeRate };
};
