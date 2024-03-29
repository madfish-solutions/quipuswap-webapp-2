import { FC } from 'react';

import cx from 'classnames';

import { DATA_TEST_ID_PROP_NAME, T_ROUTE_LINK } from '@config/constants';
import {
  Button,
  Card,
  ComplexError,
  ComplexRecipient,
  ConnectWalletButton,
  PageTitle,
  SettingsButton,
  StickyBlock,
  SwapButton,
  Tabs,
  TestnetAlert
} from '@shared/components';
import { NewTokenSelect } from '@shared/components/ComplexInput/new-token-select';
import { defined, isMainnet } from '@shared/helpers';
import { TRoute } from '@shared/svg';
import { SwapTabAction } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { SwapDetails } from './components/swap-details';
import { RoutePairsProvider } from './providers/route-pairs-provider';
import { SwapLimitsProvider } from './providers/swap-limits-provider';
import { useSwapSendViewModel } from './use-swap-send.vm';

interface SwapSendProps {
  className?: string;
  initialAction?: SwapTabAction;
}

const OrdinarySwapSend: FC<SwapSendProps> = ({ className, initialAction }) => {
  const {
    accountPkh,
    action,
    blackListedTokens,
    currentTabLabel,
    dataIsStale,
    dexPoolsLoading,
    dexRoute,
    handleInputAmountChange,
    handleInputTokenChange,
    handleOutputAmountChange,
    handleOutputTokenChange,
    handleRecipientChange,
    handleRecipientChangeFromEvent,
    handleSubmit,
    handleSwapButtonClick,
    handleTabSwitch,
    inputAmount,
    inputExchangeRate,
    inputToken,
    inputTokenBalance,
    isLoading,
    isSubmitting,
    outputAmount,
    outputExchangeRate,
    outputToken,
    outputTokenBalance,
    priceImpact,
    recipient,
    updateRates,
    sellRate,
    complexErrorsProps,
    submitDisabled,
    swapFee,
    swapFeeError,
    swapInputError,
    swapOutputError,
    t,
    TabsContent,
    title,
    touchedFieldsErrors
  } = useSwapSendViewModel(initialAction);

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="swapPageTitle">{title}</PageTitle>
      <StickyBlock className={className}>
        <Card
          header={{
            content: (
              <Tabs
                tabs={TabsContent}
                activeId={defined(action)}
                setActiveId={handleTabSwitch}
                className={styles.tabs}
              />
            ),
            button: <SettingsButton colored />,
            className: styles.header
          }}
          contentClassName={styles.content}
          data-test-id="swapPageTokenSelect"
        >
          <NewTokenSelect
            showBalanceButtons={!!accountPkh}
            amount={inputAmount}
            className={styles.input}
            balance={inputTokenBalance}
            exchangeRate={inputExchangeRate}
            label="From"
            error={swapInputError}
            onAmountChange={handleInputAmountChange}
            token={inputToken}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleInputTokenChange}
            id="swap-send-from"
            placeholder="0.0"
            data-test-id="from"
          />
          <SwapButton onClick={handleSwapButtonClick} />
          <NewTokenSelect
            showBalanceButtons={false}
            amount={outputAmount}
            className={cx(styles.input)}
            balance={outputTokenBalance}
            exchangeRate={outputExchangeRate}
            label="To"
            error={swapOutputError}
            onAmountChange={handleOutputAmountChange}
            token={outputToken}
            blackListedTokens={blackListedTokens}
            onTokenChange={handleOutputTokenChange}
            inputDisabled
            id="swap-send-to"
            placeholder="0.0"
            data-test-id="to"
          />
          {action === 'send' && (
            <ComplexRecipient
              onChange={handleRecipientChangeFromEvent}
              value={recipient}
              handleInput={handleRecipientChange}
              label="Recipient address"
              id="swap-send-recipient"
              className={cx(styles.input, styles.mb24)}
              error={touchedFieldsErrors.recipient}
            />
          )}

          {complexErrorsProps.map(({ error, [DATA_TEST_ID_PROP_NAME]: dataTestId }) => (
            <ComplexError error={error} data-test-id={dataTestId} key={dataTestId} />
          ))}

          {!accountPkh && <ConnectWalletButton className={styles.button} />}
          {accountPkh && dataIsStale && !isSubmitting && (
            <Button
              loading={dexPoolsLoading}
              onClick={updateRates}
              className={styles.button}
              data-test-id="updateRatesButton"
            >
              {t('swap|Update Rates')}
            </Button>
          )}
          {accountPkh && (!dataIsStale || isSubmitting) && (
            <Button
              disabled={submitDisabled}
              loading={isSubmitting || isLoading}
              type="submit"
              onClick={handleSubmit}
              className={styles.button}
            >
              {currentTabLabel}
            </Button>
          )}

          {isMainnet() && (
            <div className={styles.poweredBy3RouteContainer}>
              <div>{t('swap|poweredBy')}</div>
              <a href={T_ROUTE_LINK}>
                <TRoute className={styles.poweredBy3Route} />
              </a>
            </div>
          )}
        </Card>
        <SwapDetails
          fee={swapFee}
          feeError={swapFeeError}
          priceImpact={priceImpact}
          inputToken={inputToken}
          outputToken={outputToken}
          route={dexRoute}
          sellRate={sellRate}
        />
      </StickyBlock>
    </>
  );
};

export const SwapSend = (props: SwapSendProps) => {
  return (
    <RoutePairsProvider>
      <SwapLimitsProvider>
        <OrdinarySwapSend {...props} />
      </SwapLimitsProvider>
    </RoutePairsProvider>
  );
};
