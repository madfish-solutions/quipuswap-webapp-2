import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useTokens } from '@utils/dapp';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useParseTokensFromUrl = () => {
  const router = useRouter();
  const { data: tokens } = useTokens();

  const [tokenA, setTokenA] = useState<Nullable<WhitelistedToken>>(null);
  const [tokenB, setTokenB] = useState<Nullable<WhitelistedToken>>(null);

  useEffect(() => {
    const tokensUrl = router.asPath.split('/')[3].split('-');
    const tokenAFromUrl = tokensUrl[0];
    const tokenBFromUrl = tokensUrl[1];
    const [contractTokenA, idTokenA] = tokenAFromUrl.split('_');
    const [contractTokenB, idTokenB] = tokenBFromUrl.split('_');

    const validTokenA = tokens.find(token => {
      if (
        idTokenA !== undefined &&
        token.fa2TokenId &&
        token.fa2TokenId.toString() === idTokenA &&
        token.contractAddress === contractTokenA
      ) {
        return token;
      }

      if (contractTokenA === token.contractAddress) {
        return token;
      }

      return undefined;
    });
    const validTokenB = tokens.find(token => {
      if (
        idTokenB !== undefined &&
        token.fa2TokenId &&
        token.fa2TokenId.toString() === idTokenB &&
        token.contractAddress === contractTokenB
      ) {
        return token;
      }

      if (contractTokenB === token.contractAddress) {
        return token;
      }

      return undefined;
    });

    if (validTokenA) {
      setTokenA(validTokenA);
    }
    if (validTokenB) {
      setTokenB(validTokenB);
    }
    // eslint-disable-next-line
  }, [tokens]);

  return { tokenA, tokenB, setTokenA, setTokenB };
};
