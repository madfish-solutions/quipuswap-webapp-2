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
  useNetwork,
  useTokens,
  useSearchCustomTokens,
} from '@utils/dapp';
import {
  fallbackTokenToTokenData,
  handleTokenChange,
  handleSearchToken,
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
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);
  const { from, to } = useRouterPair({
    page: 'swap',
    urlLoaded,
    initialLoad,
    token1,
    token2,
  });

  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );

  const { Form } = withTypes<SwapFormValues>();

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

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: 'Swap completed!',
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

  const handleSwapTokens = () => {
    setTokens([token2, token1]);
    setTokensData({ first: tokensData.second, second: tokensData.first });
  };

  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0) {
      handleSearchToken({
        tokens,
        network,
        accountPkh: accountPkh!,
        from,
        to,
        setInitialLoad,
        setUrlLoaded,
        setTokens,
        searchCustomToken,
        handleTokenChangeWrapper,
      });
    }
  }, [from, to, initialLoad, tokens]);

  useEffect(() => {
    if (tezos && token1 && token2) {
      handleTokenChangeWrapper(token1, 'first');
      handleTokenChangeWrapper(token2, 'second');
    }
  }, [tezos, accountPkh, networkId]);

  useEffect(() => {
    setTokens([TEZOS_TOKEN, STABLE_TOKEN]);
  }, [networkId]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={(values, form) => {
          if (!tezos) return;
          submitForm(values,
            tezos,
            tokensData,
            tabsState,
            networkId,
            form,
            (err) => handleErrorToast(err),
            handleSuccessToast);
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
            handleTokenChange={handleTokenChangeWrapper}
            currentTab={currentTab}
          />
        )}
      />
    </StickyBlock>
  );
};
