import { useTranslation } from 'next-i18next';
import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { useRouter } from 'next/router';
import { withTypes } from 'react-final-form';
import {
  TransferParams,
} from '@quipuswap/sdk';

import { useRouterPair } from '@hooks/useRouterPair';
import { useExchangeRates } from '@hooks/useExchangeRate';
import useUpdateToast from '@hooks/useUpdateToast';
import {
  findTokensByList,
  useAccountPkh, useLists, useNetwork, useOnBlock, useSearchCustomTokens, useTezos,
} from '@utils/dapp';
import {
  fallbackTokenToTokenData,
  handleTokenChange,
  handleSearchToken,
} from '@utils/helpers';
import {
  LiquidityFormValues,
  TokenDataMap,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { StickyBlock } from '@components/common/StickyBlock';

import { LiquidityForm } from './LiquidityForm';
import { LiquidityChart } from './LiquidityChart';
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
  const { t } = useTranslation(['common', 'swap', 'liquidity']);
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const { data: lists } = useLists();
  const tokens = useMemo(() => findTokensByList(lists), [lists]);
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const network = useNetwork();
  const searchCustomToken = useSearchCustomTokens();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );

  const [removeLiquidityParams, setRemoveLiquidityParams] = useState<TransferParams[]>([]);
  const [addLiquidityParams, setAddLiquidityParams] = useState<TransferParams[]>([]);
  const { Form } = withTypes<LiquidityFormValues>();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);
  const router = useRouter();
  const [tabsState, setTabsState] = useState(router.query.method); // TODO: Change to routes
  const { from, to } = useRouterPair({
    page: `liquidity/${router.query.method}`,
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
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback((text:string) => {
    updateToast({
      type: 'success',
      render: t(text),
    });
  }, [updateToast, t]);

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
    if (from && to && !initialLoad && tokens.length > 0) {
      handleSearchToken({
        tokens,
        tezos: tezos!,
        network,
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
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, exchangeRates]);

  const getBalance = useCallback(() => {
    if (tezos && token1 && token2) {
      handleTokenChangeWrapper(token1, 'first');
      handleTokenChangeWrapper(token2, 'second');
      hanldeTokenPairSelect(
        { token1, token2 } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChangeWrapper,
      );
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, network.id, token1, token2]);

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line
  }, [tezos, accountPkh, network.id]);

  useOnBlock(tezos, getBalance);

  return (
    <>
      <LiquidityChart token1={token1} token2={token2} />
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
              currentTab.id,
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
    </>
  );
};
