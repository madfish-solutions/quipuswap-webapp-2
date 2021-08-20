import { useRouter } from 'next/router';
import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import BigNumber from 'bignumber.js';
import { withTypes } from 'react-final-form';

import { useExchangeRates } from '@hooks/useExchangeRate';
import useUpdateToast from '@hooks/useUpdateToast';
import {
  QSMainNet, SwapFormValues, TokenDataMap, WhitelistedToken,
} from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  getUserBalance,
  useNetwork,
  useTokens,
  useSearchCustomTokens,
} from '@utils/dapp';
import {
  fallbackTokenToTokenData,
  getWhitelistedTokenSymbol,
  localSearchToken,
} from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { StickyBlock } from '@components/common/StickyBlock';

import { SwapForm } from './SwapForm';
import { submitForm } from './swapHelpers';

const TabsContent = [
  {
    id: 'swap',
    label: 'Swap',
  },
  {
    id: 'send',
    label: 'Send',
  },
];

type SwapSendProps = {
  className?: string
};

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const network = useNetwork();
  const searchCustomToken = useSearchCustomTokens();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const router = useRouter();
  const { from, to } = router.query;

  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );

  const { Form } = withTypes<SwapFormValues>();
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleTokenChange = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    if (!exchangeRates || !exchangeRates.find) return;
    let finalBalance = '0';
    if (tezos && accountPkh) {
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId,
      );
      if (balance) {
        finalBalance = balance.div(
          new BigNumber(10)
            .pow(
              new BigNumber(token.metadata.decimals),
            ),
        ).toString();
      }
    }

    const tokenExchangeRate = exchangeRates.find((el: {
      tokenAddress: string,
      tokenId?: number,
      exchangeRate: string
    }) => {
      const isTokenTez = token.contractAddress === TEZOS_TOKEN.contractAddress
      && el.tokenAddress === undefined;
      if (isTokenTez) return true;
      if (el.tokenAddress === token.contractAddress) {
        if (!token.fa2TokenId) return true;
        if (token.fa2TokenId && el.tokenId === token.fa2TokenId) return true;
      }
      return false;
    });

    setTokensData((prevState) => (
      {
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
      }
    ));
  };

  const handleSwapTokens = () => {
    setTokens([token2, token1]);
    setTokensData({ first: tokensData.second, second: tokensData.first });
  };

  useEffect(() => {
    console.log(router.query, window.location.search);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (!initialLoad) {
      if (!params.from) {
        const url = `/swap?from=${getWhitelistedTokenSymbol(TEZOS_TOKEN)}&to=${getWhitelistedTokenSymbol(STABLE_TOKEN)}`;
        router.replace(url, undefined, { shallow: true });
        console.log(url);
        return;
      } if (!params.to) {
        let toToken;
        if (params.from === STABLE_TOKEN.metadata.symbol) {
          toToken = getWhitelistedTokenSymbol(TEZOS_TOKEN);
        } else {
          toToken = getWhitelistedTokenSymbol(STABLE_TOKEN);
        }
        const url = `/swap?from=${params.from}&to=${toToken}`;
        console.log(url);
        router.replace(url, undefined, { shallow: true });
      }
      //
    } else {
      const fromToken = token1 && token1.contractAddress !== TEZOS_TOKEN.contractAddress
        ? getWhitelistedTokenSymbol(token1, 36)
        : getWhitelistedTokenSymbol(TEZOS_TOKEN);
      let toToken;
      if (token2) {
        toToken = getWhitelistedTokenSymbol(token2, 36);
      } else if (token1 && token1.contractAddress !== TEZOS_TOKEN.contractAddress) {
        toToken = getWhitelistedTokenSymbol(TEZOS_TOKEN);
      } else {
        toToken = getWhitelistedTokenSymbol(STABLE_TOKEN);
      }
      // const toToken = token2 && token2.contractAddress !== STABLE_TOKEN.contractAddress
      //   ? getWhitelistedTokenSymbol(token2)
      //   : getWhitelistedTokenSymbol(STABLE_TOKEN);
      const url = `/swap?from=${fromToken}&to=${toToken}`;
      console.log(url, token1, token2, initialLoad);
      router.replace(url, undefined, { shallow: true });
    }
  }, [token1, token2]);

  useEffect(() => {
    const asyncCall = async () => {
      setInitialLoad(true);
      const searchPart = async (str:string | string[]):Promise<WhitelistedToken> => {
        const strStr = Array.isArray(str) ? str[0] : str;
        const inputValue = strStr.split('_')[0];
        const inputToken = strStr.split('_')[1] ?? '0';
        const isTokens = tokens
          .filter(
            (token:any) => localSearchToken(
              token,
              network,
              inputValue,
              +inputToken,
            ),
          );
        if (isTokens.length === 0) {
          return await searchCustomToken(inputValue, +inputToken, true).then((x) => {
            if (x) {
              return x;
            }
            router.push('/swap');
            return TEZOS_TOKEN;
          });
        }
        return isTokens[0];
      };
      let res:any[] = [];
      if (from) {
        if (to) {
          const resTo = await searchPart(to);
          res = [resTo];
          handleTokenChange(resTo, 'second');
        }
        const resFrom = await searchPart(from);
        res = [resFrom, ...res];
        handleTokenChange(resFrom, 'first');
      }
      console.log(from, to, res);
      setTokens(res);
    };
    if (from && to && !initialLoad) asyncCall();
  }, [from, to, initialLoad]);

  useEffect(() => {
    if (tezos && token1 && token2) {
      handleTokenChange(token1, 'first');
      handleTokenChange(token2, 'second');
    }
  }, [tezos, accountPkh, networkId]);

  useEffect(() => {
    setTokens([]);
  }, [networkId]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={(values) => {
          if (!tezos) return;
          submitForm(values,
            tezos,
            tokensData,
            tabsState,
            networkId,
            (err) => handleErrorToast(err));
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({
          handleSubmit, form,
        }) => (
          <SwapForm
            handleSubmit={handleSubmit}
            form={form}
            debounce={1000}
            save={() => {}}
            setTabsState={setTabsState}
            tabsState={tabsState}
            token1={token1}
            token2={token2}
            setToken1={(token:WhitelistedToken) => setTokens([token, (token2 || undefined)])}
            setToken2={(token:WhitelistedToken) => setTokens([(token1 || undefined), token])}
            tokensData={tokensData}
            handleSwapTokens={handleSwapTokens}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
          />
        )}
      />
    </StickyBlock>
  );
};
