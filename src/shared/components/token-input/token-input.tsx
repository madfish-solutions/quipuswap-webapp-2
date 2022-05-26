import { FC, useContext } from 'react';

import cx from 'classnames';

import { DOLLAR } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Danger } from '@shared/elements';
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

export const TokenInput: FC<TokenInputProps> = ({
  id,
  className,
  label,
  dollarEquivalent,
  tokens = [],
  value,
  balance,
  error,
  disabled,
  hiddenPercentSelector,
  readOnly,
  onInputChange,
  onSelectorClick
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const {
    isFocused,
    inputRef,
    notWhitelistedMessage,

    isFormReady,
    showPercentSelector,

    amountCap,

    focusInput,
    handleInputFocus,
    handleInputBlur,

    handleInputChange,
    handlePercentageSelect
  } = useTokenInputViewModel({
    value,
    tokens,
    balance,
    readOnly,
    hiddenPercentSelector,
    onInputChange
  });

  const compoundClassName = cx(
    { [styles.focused]: isFocused, [styles.error]: !!error, [styles.readOnly]: !isFormReady },
    themeClass[colorThemeMode],
    className
  );

  const compoundSelectorClassName = cx(styles.selector, { [styles.frozen]: Boolean(onSelectorClick) });

  return (
    <div
      className={compoundClassName}
      onClick={focusInput}
      onKeyPress={focusInput}
      role="button"
      tabIndex={0}
      data-test-id="tokenInputContainer"
    >
      <label htmlFor={id} className={styles.label} data-test-id="tokenInputLabel">
        {label}
      </label>
      <div className={styles.background}>
        <div className={styles.shape}>
          <div className={cx(styles.dollarEquivalent, styles.label2)}>
            {dollarEquivalent && <StateCurrencyAmount amount={dollarEquivalent} currency={DOLLAR} />}
          </div>
          <div className={styles.balance}>
            {isFormReady && <Balance balance={balance} colorMode={colorThemeMode} />}
          </div>
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
              <TokensLogos tokens={tokens} />
              <TokensSymbols tokens={tokens} />
              {Boolean(onSelectorClick) && <Shevron />}
            </Button>
          </div>
        </div>
      </div>
      <Scaffolding showChild={showPercentSelector} className={styles.scaffoldingPercentSelector}>
        <PercentSelector amountCap={amountCap} value={balance} handleBalance={handlePercentageSelect} />
      </Scaffolding>
      <ComplexError error={error} />
    </div>
  );
};
