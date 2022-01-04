import { useEffect, useState } from 'react';

import { findDex, FoundDex, Token } from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import {
  findNotTezTokenInPair,
  getValidMichelTemplate,
  sortTokensContracts
} from '@containers/Liquidity/liquidutyHelpers';
import { getStorageInfo, getUserBalance, useAccountPkh, useNetwork, useTezos, useTokens } from '@utils/dapp';
import { FACTORIES, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { useFlowToasts } from '@hooks/use-flow-toasts';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

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
  const { t } = useTranslation(['common']);
  const {showErrorToast} = useFlowToasts();
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const accountPkh = useAccountPkh();
  const router = useRouter();
  const { data: tokens } = useTokens();

  const [tabState, setTabState] = useState(TabsContent[0]);
  const [tokenA, setTokenA] = useState<WhitelistedToken | null>(null);
  const [tokenB, setTokenB] = useState<WhitelistedToken | null>(null);
  const [tokenABalance, setTokenABalance] = useState<string>('0');
  const [tokenBBalance, setTokenBBalance] = useState<string>('0');
  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');
  const [dexInfo, setDexInfo] = useState<{
    dex: FoundDex | null;
    isTezosToTokenDex: boolean;
  }>({ dex: null, isTezosToTokenDex: false });

  const checkForTezInPair = (contractAddressA: string, contractAddressB: string) =>
    [contractAddressA, contractAddressB].includes(TEZOS_TOKEN.contractAddress);

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

  // eslint-disable-next-line sonarjs/cognitive-complexity
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
  }, [router.asPath, tokens]);

  useEffect(() => {
    if (!tokenA || !tokenB) {
      return;
    }
    const from = tokenA.contractAddress + (tokenA.type === 'fa1.2' ? '' : `_${tokenA.fa2TokenId}`);
    const to = tokenB.contractAddress + (tokenB.type === 'fa1.2' ? '' : `_${tokenB.fa2TokenId}`);
    void router.replace(`/liquidity/${tabState.id}/${from}-${to}`, undefined, { shallow: true });
    //eslint-disable-next-line
  }, [tabState.id, tokenA, tokenB]);

  useEffect(() => {
    let isMounted = true;
    let foundDex: FoundDex;

    const loadDex = async () => {
      if (!tezos || !tokenA || !tokenB) {
        return;
      }
      const isTezosInPair = checkForTezInPair(tokenA.contractAddress, tokenB.contractAddress);

      try {
        if (isTezosInPair) {
          const notTezToken = findNotTezTokenInPair(tokenA, tokenB);
          const token: Token = {
            contract: notTezToken.contractAddress,
            id: notTezToken.fa2TokenId
          };

          foundDex = await findDex(tezos, FACTORIES[networkId], token);
        } else {
          const contractPromise = tezos.wallet.at(TOKEN_TO_TOKEN_DEX);
          const storagePromise = getStorageInfo(tezos, TOKEN_TO_TOKEN_DEX);
          const [contract, storage] = await Promise.all([contractPromise, storagePromise]);

          foundDex = new FoundDex(contract, storage);
        }

        if (isMounted) {
          setDexInfo({ dex: foundDex, isTezosToTokenDex: isTezosInPair });
        }
      } catch (error) {
        if (isMounted) {
          setDexInfo({ dex: null, isTezosToTokenDex: isTezosInPair });
        }
        showErrorToast(error as Error)
      }
    };
    void loadDex();

    return () => {
      isMounted = false;
    };
  }, [tezos, networkId, tokenA, tokenB, showErrorToast, t]);

  useEffect(() => {
    let isMounted = true;
    const getTokenABalance = async () => {
      if (!tezos || !accountPkh || !tokenA) {
        return;
      }

      const userTokenABalance = await getUserBalance(
        tezos,
        accountPkh,
        tokenA.contractAddress,
        tokenA.type,
        tokenA.fa2TokenId
      );

      if (userTokenABalance && isMounted) {
        setTokenABalance(fromDecimals(userTokenABalance, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
      } else if (!userTokenABalance && isMounted) {
        setTokenABalance('0');
      }
    };
    void getTokenABalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, tokenA]);

  useEffect(() => {
    let isMounted = true;
    const getTokenBBalance = async () => {
      if (!tezos || !accountPkh || !tokenB) {
        return;
      }

      const userTokenBBalance = await getUserBalance(
        tezos,
        accountPkh,
        tokenB.contractAddress,
        tokenB.type,
        tokenB.fa2TokenId
      );

      if (userTokenBBalance && isMounted) {
        setTokenBBalance(fromDecimals(userTokenBBalance, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
      } else if (!userTokenBBalance && isMounted) {
        setTokenBBalance('0');
      }
    };
    void getTokenBBalance();

    return () => {
      isMounted = false;
    };
  }, [tezos, accountPkh, tokenB]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      const { dex, isTezosToTokenDex } = dexInfo;

      if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
        return;
      }

      if (isTezosToTokenDex) {
        const notTezToken = findNotTezTokenInPair(tokenA, tokenB);
        const userLpTokenBalance = await getUserBalance(
          tezos,
          accountPkh,
          dex.contract.address,
          notTezToken.type,
          notTezToken.fa2TokenId
        );

        if (userLpTokenBalance && isMounted) {
          setLpTokenBalance(userLpTokenBalance.dividedBy(1_000_000).toFixed());
        } else if (!userLpTokenBalance && isMounted) {
          setLpTokenBalance('0');
        }
      } else if (!isTezosToTokenDex) {
        const addresses = sortTokensContracts(tokenA, tokenB);
        if (!addresses) {
          return;
        }

        const michelData = getValidMichelTemplate(addresses);
        const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');
        const pairId = await dex.storage.storage.token_to_id.get(key);
        if (pairId) {
          const userLpTokenBalance = await dex.storage.storage.ledger.get([accountPkh, pairId]);

          if (userLpTokenBalance && isMounted) {
            setLpTokenBalance(userLpTokenBalance.balance.dividedBy(1_000_000).toFixed());
          } else if (!userLpTokenBalance && isMounted) {
            setLpTokenBalance('0');
          }
        } else if (!pairId && isMounted) {
          setLpTokenBalance('0');
        }
      }
    };
    void getLpTokenBalance();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, dexInfo]);

  const handleChangeTokensPair = ({ token1, token2 }: WhitelistedTokenPair) => {
    setTokenA(token1);
    setTokenB(token2);
  };

  return {
    tabState,
    handleSetActiveId,
    dexInfo,
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
