import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useDexContract } from '@containers/Liquidity/hooks/useDexContract';
import { useLoadLpTokenBalance, useLoadTokenBalance } from '@containers/Liquidity/LiquidityForms/hooks';
import { isTezInPair } from '@containers/Liquidity/liquidutyHelpers';
import { useTokens } from '@utils/dapp';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export const TabsContent = [
  {
    id: 'add',
    label: 'Add'
  },
  {
    id: 'remove',
    label: 'Remove'
  }
];

export const useViewModel = () => {
  const router = useRouter();
  const { data: tokens } = useTokens();

  const [tabState, setTabState] = useState(TabsContent[0]);
  const [tokenA, setTokenA] = useState<WhitelistedToken | null>(null);
  const [tokenB, setTokenB] = useState<WhitelistedToken | null>(null);

  const dexContract = useDexContract(tokenA, tokenB);

  const lpTokenBalance = useLoadLpTokenBalance(dexContract, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);

  const handleSetActiveId = (tabId: string) => {
    const url = router.asPath.split('/');
    url[2] = tabId;
    const newUrl = url.join('/');

    void router.replace(newUrl, undefined, { shallow: true });
    const findActiveTab = TabsContent.find(tab => tab.id === tabId);
    if (!findActiveTab) {
      return;
    }
    setTabState(findActiveTab);
  };

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
  }, [router.asPath]);

  useEffect(() => {
    if (!tokenA || !tokenB) {
      return;
    }
    const from = tokenA.contractAddress + (tokenA.type === 'fa1.2' ? '' : `_${tokenA.fa2TokenId}`);
    const to = tokenB.contractAddress + (tokenB.type === 'fa1.2' ? '' : `_${tokenB.fa2TokenId}`);
    void router.replace(`/liquidity/${tabState.id}/${from}-${to}`, undefined, { shallow: true });
    // eslint-disable-next-line
  }, [tabState.id, tokenA, tokenB]);

  const handleChangeTokensPair = ({ token1, token2 }: WhitelistedTokenPair) => {
    setTokenA(token1);
    setTokenB(token2);
  };

  return {
    tabState,
    handleSetActiveId,
    dexInfo: {
      dex: dexContract,
      isTezosToTokenDex: tokenA && tokenB && isTezInPair(tokenA.contractAddress, tokenB.contractAddress)
    },
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleChangeTokensPair
  };
};
