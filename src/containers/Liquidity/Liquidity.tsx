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

import { getUserBalance, useAccountPkh, useTezos } from '@utils/dapp';
import { useExchangeRates } from '@hooks/useExchangeRate';
import useUpdateToast from '@hooks/useUpdateToast';
import {
  LiquidityFormValues,
  TokenDataMap,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { StickyBlock } from '@components/common/StickyBlock';

import { fallbackTokenToTokenData } from '@utils/helpers';
import { LiquidityForm } from './LiquidityForm';
import { submitForm } from './liquidityHelpers';

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
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
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
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);
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
    }) => (
      token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined ? el
        : el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

    const newTokensData = {
      ...tokensData,
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
    };

    setTokensData(newTokensData);
  };

  useEffect(() => {
    if (exchangeRates && tezos && accountPkh && !initialLoad) {
      setInitialLoad(true);
      if (!tokensData.first.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.first.token.address,
            type: tokensData.first.token.type,
            metadata:
            {
              decimals: tokensData.first.token.decimals,
            },
          } as WhitelistedToken, 'first',
        );
      }
      if (!tokensData.second.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.second.token.address,
            type: tokensData.second.token.type,
            metadata:
          {
            decimals: tokensData.second.token.decimals,
          },
          } as WhitelistedToken, 'second',
        );
      }
    }
  }, [exchangeRates, tezos, accountPkh]);

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
