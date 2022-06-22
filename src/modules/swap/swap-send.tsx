import { FC } from 'react';

import cx from 'classnames';

import { MAX_HOPS_COUNT } from '@config/constants';
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
import { defined, FormatNumber } from '@shared/helpers';
import { SwapTabAction } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { SwapDetails } from './components/swap-details';
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
    buyRate,
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
    isSubmitting,
    noRouteFound,
    outputAmount,
    outputExchangeRate,
    outputToken,
    outputTokenBalance,
    PRICE_IMPACT_WARNING_THRESHOLD,
    priceImpact,
    recipient,
    updateRates,
    sellRate,
    shouldHideRouteRow,
    shouldShowPriceImpactWarning,
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
                values={TabsContent}
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

          {noRouteFound && (
            <ComplexError
              error={t('swap|noRouteFoundError', { maxHopsCount: MAX_HOPS_COUNT })}
              data-test-id="noRouteFound"
            />
          )}

          {shouldShowPriceImpactWarning && (
            <ComplexError
              error={t('swap|priceImpactWarning', {
                priceImpact: FormatNumber(priceImpact ?? PRICE_IMPACT_WARNING_THRESHOLD)
              })}
              data-test-id="shouldShowPriceImpactWarning"
            />
          )}

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
              loading={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              className={styles.button}
            >
              {currentTabLabel}
            </Button>
          )}
        </Card>
        <SwapDetails
          fee={swapFee}
          feeError={swapFeeError}
          priceImpact={priceImpact}
          inputToken={inputToken}
          outputToken={outputToken}
          route={dexRoute}
          buyRate={buyRate}
          sellRate={sellRate}
          shouldHideRouteRow={shouldHideRouteRow}
        />
      </StickyBlock>
    </>
  );
};

export const SwapSend = (props: SwapSendProps) => {
  return (
    <SwapLimitsProvider>
      <OrdinarySwapSend {...props} />
    </SwapLimitsProvider>
  );
};
