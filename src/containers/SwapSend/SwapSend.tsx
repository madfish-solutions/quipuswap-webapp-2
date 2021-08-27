import { useRouter } from 'next/router';
import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { withTypes } from 'react-final-form';

import { useExchangeRates } from '@hooks/useExchangeRate';
import { useRouterPair } from '@hooks/useRouterPair';
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
  fromDecimals,
  getWhitelistedTokenSymbol,
  isTokenEqual,
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
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const router = useRouter();
  const { from, to } = useRouterPair();

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
        finalBalance = fromDecimals(balance, token.metadata.decimals).toString();
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
    if (urlLoaded && initialLoad) {
      if (token1 && token2) {
        const fromToken = getWhitelistedTokenSymbol(token1, 36);
        const toToken = getWhitelistedTokenSymbol(token2, 36);
        const url = `/swap/${fromToken}-${toToken}`;
        router.replace(url, undefined, { shallow: true });
      }
    }
  }, [token1, token2]);

  useEffect(() => {
    if (!from) {
      const url = `/swap/${getWhitelistedTokenSymbol(TEZOS_TOKEN)}-${getWhitelistedTokenSymbol(STABLE_TOKEN)}`;
      router.replace(url, undefined, { shallow: true });
      return;
    } if (!to) {
      let toToken;
      if (from === STABLE_TOKEN.metadata.symbol) {
        toToken = getWhitelistedTokenSymbol(TEZOS_TOKEN);
      } else if (from === TEZOS_TOKEN.metadata.symbol) {
        toToken = getWhitelistedTokenSymbol(STABLE_TOKEN);
      }
      const url = `/swap/${from}-${toToken}`;
      router.replace(url, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    const asyncCall = async () => {
      setInitialLoad(true);
      setUrlLoaded(false);
      const searchPart = async (str:string | string[]):Promise<WhitelistedToken> => {
        const strStr = Array.isArray(str) ? str[0] : str;
        const inputValue = strStr.split('_')[0];
        const inputToken = strStr.split('_')[1] ?? -1;
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
      setUrlLoaded(true);
      if (!isTokenEqual(res[0], res[1])) {
        setTokens(res);
      }
    };
    if (from && to && !initialLoad && tokens.length > 0) asyncCall();
  }, [from, to, initialLoad, tokens]);

  useEffect(() => {
    if (tezos && token1 && token2) {
      handleTokenChange(token1, 'first');
      handleTokenChange(token2, 'second');
    }
  }, [tezos, accountPkh, networkId]);

  useEffect(() => {
    setTokens([TEZOS_TOKEN, STABLE_TOKEN]);
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
            debounce={100}
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
