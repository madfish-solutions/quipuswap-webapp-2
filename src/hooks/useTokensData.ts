import {useCallback, useState} from 'react';

import {getUserBalance, useAccountPkh, useTezos} from '@utils/dapp';
import {TokenDataMap, WhitelistedToken} from '@utils/types';
import {STABLE_TOKEN, TEZOS_TOKEN} from '@utils/defaults';
import {fallbackTokenToTokenData, fromDecimals} from '@utils/helpers';
import {useExchangeRates} from './useExchangeRate';

type TokenChangeType = {
  token: WhitelistedToken;
  tokenNumber: 'first' | 'second';
};

const curObj = {
  first: Date.now(),
  second: Date.now(),
};

export const useTokensData = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(STABLE_TOKEN),
  });
  const exchangeRates = useExchangeRates();
  const handleTokenChange = useCallback(
    ({token, tokenNumber, nonce = Date.now()}: TokenChangeType & {nonce?: number}) => {
      if (!exchangeRates || !exchangeRates.find) return;
      let finalBalance = '0';
      if (tezos && accountPkh) {
        try {
          curObj[tokenNumber] = nonce;
          getUserBalance(
            tezos,
            accountPkh,
            token.contractAddress,
            token.type,
            token.fa2TokenId,
          ).then((balance) => {
            if (curObj[tokenNumber] !== nonce) return;
            if (balance) {
              finalBalance = fromDecimals(balance, token.metadata.decimals).toString();
            }
            const tokenExchangeRate = exchangeRates.find(
              (el: {tokenAddress: string; tokenId?: number; exchangeRate: string}) => {
                const isTokenTez =
                  token.contractAddress === TEZOS_TOKEN.contractAddress &&
                  el.tokenAddress === undefined;
                if (isTokenTez) return true;
                if (el.tokenAddress === token.contractAddress) {
                  if (!token.fa2TokenId) return true;
                  if (token.fa2TokenId && el.tokenId === token.fa2TokenId) return true;
                }
                return false;
              },
            );

            setTokensData((prevState) => ({
              ...prevState,
              [tokenNumber]: {
                token: {
                  address: token.contractAddress,
                  type: token.type,
                  id: token.fa2TokenId,
                  decimals: token.metadata.decimals,
                },
                balance: finalBalance,
                exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
              },
            }));
          });
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      }
    },
    [tezos, accountPkh],
  );

  const handleSwapTokens = useCallback(() => {
    setTokensData({first: tokensData.second, second: tokensData.first});
  }, [tokensData.first, tokensData.second]);

  return {
    tokensData,
    handleTokenChange,
    handleSwapTokens,
  };
};
