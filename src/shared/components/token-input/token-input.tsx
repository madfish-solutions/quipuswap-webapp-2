import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { DOLLAR } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Danger } from '@shared/elements';
import { TokensModal } from '@shared/modals/tokens-modal';
import { Shevron } from '@shared/svg';

import { Button } from '../button';
import { ComplexError } from '../complex-error';
import { PercentSelector } from '../percent-selector';
import { Scaffolding } from '../scaffolding';
import { StateCurrencyAmount } from '../state-components';
import { Balance } from '../state-components/balance';
import { TokensLogos } from '../tokens-logo';
import { TokensSymbols } from '../tokens-symbols';
import styles from './token-input.module.scss';
import { useTokenInputViewModel } from './token-input.vm';
import { TokenInputProps } from './types';

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TokenInput: FC<TokenInputProps> = observer(
  ({
    id,
    className,
    label,
    dollarEquivalent,
    tokens,
    value,
    balance,
    error,
    disabled,
    hiddenPercentSelector,
    hiddenBalance,
    readOnly,
    balanceText,
    decimals,
    tokenInputDTI,
    onInputChange,
    onSelectorClick
  }) => {
    const { colorThemeMode } = useContext(ColorThemeContext);
    const {
      isFocused,
      inputRef,
      notWhitelistedMessage,

      isFormReady,
      shownPercentSelector,
      shownBalance,
      amountCap,

      focusInput,
      handleInputFocus,
      handleInputBlur,

      handleInputChange,
      handlePercentageSelect
    } = useTokenInputViewModel({
      tokens,
      readOnly,
      hiddenPercentSelector,
      hiddenBalance,
      onInputChange
    });
    const compoundClassName = cx(
      { [styles.focused]: isFocused, [styles.error]: !!error, [styles.readOnly]: !isFormReady },
      themeClass[colorThemeMode],
      className
    );

    const compoundSelectorClassName = cx(styles.selector, { [styles.frozen]: !Boolean(onSelectorClick) });

    return (
      <div
        className={compoundClassName}
        onClick={focusInput}
        onKeyPress={focusInput}
        role="button"
        tabIndex={0}
        data-test-id={tokenInputDTI}
      >
        <TokensModal />
        <label htmlFor={id} className={styles.label} data-test-id="tokenInputLabel">
          {label}
        </label>
        <div className={styles.background}>
          <div className={styles.shape}>
            <div className={cx(styles.dollarEquivalent, styles.label2)}>
              {dollarEquivalent && <StateCurrencyAmount amount={dollarEquivalent} currency={DOLLAR} />}
            </div>
            <div className={styles.balance}>
              {shownBalance && <Balance text={balanceText} balance={balance} colorMode={colorThemeMode} />}
            </div>
            {readOnly ? (
              <div className={cx(styles.item, styles.readOnlyValue)}>{value}</div>
            ) : (
              <input
                id={id}
                className={cx(styles.item, styles.input)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                ref={inputRef}
                value={value}
                autoComplete="off"
                disabled={!isFormReady || disabled}
                onChange={handleInputChange}
              />
            )}
            <div className={styles.dangerContainer}>
              {notWhitelistedMessage && <Danger content={notWhitelistedMessage} />}
              <Button
                disabled={!isFormReady}
                theme="quaternary"
                className={compoundSelectorClassName}
                textClassName={styles.selectorInner}
                data-test-id="tokenInputSelectButton"
                onClick={onSelectorClick}
              >
                {tokens ? (
                  <>
                    <TokensSymbols tokens={tokens} />
                    <TokensLogos tokens={tokens} />
                  </>
                ) : (
                  'SELECT'
                )}
                {Boolean(onSelectorClick) && <Shevron />}
              </Button>
            </div>
          </div>
        </div>
        <Scaffolding showChild={shownPercentSelector} className={styles.scaffoldingPercentSelector}>
          <PercentSelector
            decimals={decimals}
            amountCap={amountCap}
            value={balance}
            handleBalance={handlePercentageSelect}
          />
        </Scaffolding>
        {error && <ComplexError error={error} />}
      </div>
    );
  }
);
