import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { withTypes } from 'react-final-form';
import {
  FoundDex,
  TransferParams,
} from '@quipuswap/sdk';

import { useRouterPair } from '@hooks/useRouterPair';
import { useExchangeRates } from '@hooks/useExchangeRate';
import useUpdateToast from '@hooks/useUpdateToast';
import {
  useAccountPkh, useNetwork, useOnBlock, useSearchCustomTokens, useTezos, useTokens,
} from '@utils/dapp';
import {
  fallbackTokenToTokenData,
  handleTokenChange,
  handleSearchToken,
} from '@utils/helpers';
import {
  LiquidityFormValues,
  QSMainNet,
  TokenDataMap,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { StickyBlock } from '@components/common/StickyBlock';

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
  const { from, to } = useRouterPair({
    page: 'liquidity',
    urlLoaded,
    initialLoad,
    token1,
    token2,
  });

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

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: 'Loading',
    });
  }, [updateToast]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: currentTab.id === 'remove' ? 'Divest completed!' : 'Invest completed!',
    });
  }, [updateToast]);

  const handleTokenChangeWrapper = (
    token: WhitelistedToken,
    tokenNumber: 'first' | 'second',
  ) => handleTokenChange({
    token,
    tokenNumber,
    exchangeRates,
    tezos: tezos!,
    accountPkh: accountPkh!,
    setTokensData,
  });

  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0 && exchangeRates) {
      handleSearchToken({
        tokens,
        tezos: tezos!,
        network,
        accountPkh: accountPkh!,
        from,
        to,
        fixTokenFrom: TEZOS_TOKEN,
        setInitialLoad,
        setUrlLoaded,
        setTokens,
        setTokenPair,
        searchCustomToken,
        handleTokenChangeWrapper,
      });
    }
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const getBalance = useCallback(() => {
    if (tezos && token1 && token2) {
      handleTokenChangeWrapper(token1, 'first');
      handleTokenChangeWrapper(token2, 'second');
      hanldeTokenPairSelect(
        { token1, token2 } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChangeWrapper,
        tezos,
        accountPkh,
        network.id as QSMainNet,
      );
    }
  }, [tezos, accountPkh, network.id]);

  useEffect(() => {
    getBalance();
  }, [tezos, accountPkh, network.id]);

  useOnBlock(tezos, getBalance);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={() => {
          if (!tezos) return;
          handleLoader();
          submitForm(
            tezos,
            currentTab.id === 'remove'
              ? removeLiquidityParams
              : addLiquidityParams,
            handleErrorToast,
            handleSuccessToast,
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
            debounce={100}
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
            handleTokenChange={handleTokenChangeWrapper}
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
