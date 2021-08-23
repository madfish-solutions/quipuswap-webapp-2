import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { withTypes } from 'react-final-form';
import {
  FoundDex,
  TransferParams,
} from '@quipuswap/sdk';

import {
  getUserBalance, useAccountPkh, useNetwork, useSearchCustomTokens, useTezos, useTokens,
} from '@utils/dapp';
import { useExchangeRates } from '@hooks/useExchangeRate';
import useUpdateToast from '@hooks/useUpdateToast';
import {
  LiquidityFormValues,
  QSMainNet,
  TokenDataMap,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { StickyBlock } from '@components/common/StickyBlock';

import {
  fallbackTokenToTokenData, getWhitelistedTokenSymbol, isTokenEqual, localSearchToken,
} from '@utils/helpers';
import { useRouter } from 'next/router';
import { LiquidityForm } from './LiquidityForm';
import { hanldeTokenPairSelect, submitForm } from './liquidityHelpers';

const TabsContent = [
  {
    id: 'add',
    label: 'Add',
  },
  {
    id: 'remove',
    label: 'Remove',
  },
];

type LiquidityProps = {
  className?: string
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
} as WhitelistedTokenPair;

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const network = useNetwork();
  const searchCustomToken = useSearchCustomTokens();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );

  const [removeLiquidityParams, setRemoveLiquidityParams] = useState<TransferParams[]>([]);
  const [addLiquidityParams, setAddLiquidityParams] = useState<TransferParams[]>([]);
  const { Form } = withTypes<LiquidityFormValues>();
  const [dex, setDex] = useState<FoundDex>();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);
  const router = useRouter();
  let from:any;
  let to:any;
  const lastSlash = window.location.pathname.lastIndexOf('/');
  const slashCount = window.location.pathname.split('/');
  const urlSearchParams = router.query['from-to'] && typeof router.query['from-to'] === 'string' ? router.query['from-to'].split('-') : window.location.pathname.slice(lastSlash + 1).split('-');
  const params = Object.fromEntries(new Map(urlSearchParams.map((x, i) => [i === 0 ? 'from' : 'to', x])));
  if (slashCount.length < 3) {
    from = 'XTZ';
    to = 'usds';
  } else if (Object.keys(router.query).length === 0 && (params.from || params.to)) {
    ({ from, to } = params);
  }
  if (!to) to = 'usds';

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
    }) => (
      token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined ? el
        : el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

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

  useEffect(() => {
    if (urlLoaded && initialLoad) {
      if (token1 && token2) {
        const fromToken = getWhitelistedTokenSymbol(token1, 36);
        const toToken = getWhitelistedTokenSymbol(token2, 36);
        const url = `/liquidity/${fromToken}-${toToken}`;
        router.replace(url, undefined, { shallow: true });
      }
    }
  }, [token1, token2]);

  useEffect(() => {
    if (urlLoaded && initialLoad) {
      const fromToken = getWhitelistedTokenSymbol(tokenPair.token1, 36);
      const toToken = getWhitelistedTokenSymbol(tokenPair.token2, 36);
      const url = `/liquidity/${fromToken}-${toToken}`;
      router.replace(url, undefined, { shallow: true });
    }
  }, [tokenPair]);

  useEffect(() => {
    if (!from) {
      const url = `/liquidity/${getWhitelistedTokenSymbol(TEZOS_TOKEN)}-${getWhitelistedTokenSymbol(STABLE_TOKEN)}`;
      router.replace(url, undefined, { shallow: true });
      return;
    } if (!to) {
      let toToken;
      if (from === STABLE_TOKEN.metadata.symbol) {
        toToken = getWhitelistedTokenSymbol(TEZOS_TOKEN);
      } else if (from === TEZOS_TOKEN.metadata.symbol) {
        toToken = getWhitelistedTokenSymbol(STABLE_TOKEN);
      }
      const url = `/liquidity/${from}-${toToken}`;
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
        // const resFrom = await searchPart(from);
        const resFrom = TEZOS_TOKEN;
        res = [resFrom, ...res];
        handleTokenChange(resFrom, 'first');
      }
      setUrlLoaded(true);
      if (!isTokenEqual(res[0], res[1])) {
        setTokens(res);
        hanldeTokenPairSelect(
          { token1: res[0], token2: res[1] } as WhitelistedTokenPair,
          setTokenPair,
          handleTokenChange,
          tezos,
          accountPkh,
          network.id as QSMainNet,
        );
      }
    };
    if (from && to && !initialLoad && tokens.length > 0 && exchangeRates) asyncCall();
  }, [from, to, initialLoad, tokens, exchangeRates]);

  useEffect(() => {
    if (tezos && token1 && token2) {
      handleTokenChange(token1, 'first');
      handleTokenChange(token2, 'second');
      hanldeTokenPairSelect(
        { token1, token2 } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChange,
        tezos,
        accountPkh,
        network.id as QSMainNet,
      );
    }
  }, [tezos, accountPkh, network.id]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={() => {
          if (!tezos) return;
          submitForm(
            tezos,
            currentTab.id === 'remove'
              ? removeLiquidityParams
              : addLiquidityParams,
            handleErrorToast,
          );
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          <LiquidityForm
            form={form}
            handleSubmit={handleSubmit}
            debounce={1000}
            save={() => {}}
            setTabsState={setTabsState}
            tabsState={tabsState}
            dex={dex}
            setDex={setDex}
            token1={token1}
            token2={token2}
            setTokens={setTokens}
            tokenPair={tokenPair}
            setTokenPair={setTokenPair}
            tokensData={tokensData}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
            setRemoveLiquidityParams={setRemoveLiquidityParams}
            removeLiquidityParams={removeLiquidityParams}
            setAddLiquidityParams={setAddLiquidityParams}
            addLiquidityParams={addLiquidityParams}
          />
        )}
      />
    </StickyBlock>

  );
};
