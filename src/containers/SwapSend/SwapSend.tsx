import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { withTypes } from 'react-final-form';
import { useTranslation } from 'next-i18next';

import { useExchangeRates } from '@hooks/useExchangeRate';
import { useRouterPair } from '@hooks/useRouterPair';
import useUpdateToast from '@hooks/useUpdateToast';
import { QSMainNet, SwapFormValues, TokenDataMap, WhitelistedToken } from '@utils/types';
import { useAccountPkh, useTezos, useNetwork, useOnBlock } from '@providers/dapp';
import { fallbackTokenToTokenData, handleTokenChange, handleSearchToken } from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { findTokensByList, useLists, useSearchCustomTokens } from '@providers/tokenLists';
import { StickyBlock } from '@components/common/StickyBlock';

import { SwapForm } from './SwapForm';
import { submitForm } from './swapHelpers';
import { SwapChart } from './SwapChart';

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
  className?: string;
};

export const SwapSend: React.FC<SwapSendProps> = ({ className }) => {
  const { t } = useTranslation(['common', 'swap']);
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const { data: lists } = useLists();
  const tokens = findTokensByList(lists);
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

  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(TEZOS_TOKEN),
    second: fallbackTokenToTokenData(STABLE_TOKEN),
  });

  const { Form } = withTypes<SwapFormValues>();

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === tabsState)!, [tabsState]);

  const handleErrorToast = useCallback(
    (err) => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    },
    [updateToast],
  );

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('swap|Swap completed!'),
    });
  }, [updateToast, t]);

  const handleTokenChangeWrapper = useCallback(
    (token: WhitelistedToken, tokenNumber: 'first' | 'second') =>
      handleTokenChange({
        token,
        tokenNumber,
        exchangeRates,
        tezos: tezos!,
        accountPkh,
        setTokensData,
      }),
    [accountPkh, exchangeRates, tezos],
  );

  const handleSwapTokens = () => {
    setTokens([token2, token1]);
    setTokensData({ first: tokensData.second, second: tokensData.first });
  };

  useEffect(() => {
    if (from && to && !initialLoad && tokens.length > 0) {
      handleSearchToken({
        tokens,
        network,
        from,
        to,
        setInitialLoad,
        setUrlLoaded,
        setTokens,
        searchCustomToken,
        handleTokenChangeWrapper,
      });
    }
    return () => {};
    // eslint-disable-next-line
  }, [from, to, initialLoad, tokens, handleTokenChangeWrapper]);

  const getBalance = useCallback(() => {
    if (tezos && token1 && token2) {
      handleTokenChangeWrapper(token1, 'first');
      handleTokenChangeWrapper(token2, 'second');
    }
    // eslint-disable-next-line
  }, [tezos, accountPkh, networkId, token1, token2, handleTokenChangeWrapper]);

  useEffect(() => {
    getBalance();
    return () => {};
  }, [getBalance]);

  useOnBlock(tezos, getBalance);

  useEffect(() => {
    setTokens([TEZOS_TOKEN, STABLE_TOKEN]);
    return () => {};
  }, [networkId]);

  return (
    <>
      <SwapChart token1={token1} token2={token2} />
      <StickyBlock className={className}>
        <Form
          onSubmit={(values, form) => {
            if (!tezos) return;
            handleLoader();
            submitForm(
              values,
              tezos,
              tokensData,
              tabsState,
              networkId,
              form,
              (err) => handleErrorToast(err),
              handleSuccessToast,
            );
          }}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
            setValues: (fields, state, { changeValue }) => {
              fields.forEach((x: any) => changeValue(state, x[0], () => x[1]));
            },
          }}
          render={({ handleSubmit, form }) => (
            <SwapForm
              handleSubmit={handleSubmit}
              form={form}
              debounce={1}
              save={() => {}}
              setTabsState={setTabsState}
              tabsState={tabsState}
              token1={token1}
              token2={token2}
              setToken1={(token: WhitelistedToken) => setTokens([token, token2 || undefined])}
              setToken2={(token: WhitelistedToken) => setTokens([token1 || undefined, token])}
              tokensData={tokensData}
              handleSwapTokens={handleSwapTokens}
              handleTokenChange={handleTokenChangeWrapper}
              currentTab={currentTab}
            />
          )}
        />
      </StickyBlock>
    </>
  );
};
