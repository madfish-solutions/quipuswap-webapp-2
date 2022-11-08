import { useNewExchangeRates } from '@providers/use-exchange-rate';
import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

export const useTokenExchangeRate = () => {
  const exchangeRates = useNewExchangeRates();

  const getTokenExchangeRate = (token: Token) => {
    const { contractAddress, fa2TokenId } = token;
    const tokenSlug = getTokenSlug({
      contractAddress: contractAddress,
      fa2TokenId: fa2TokenId
    });

    return exchangeRates[tokenSlug];
  };

  return { getTokenExchangeRate };
};
