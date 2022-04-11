import { ChangeEvent, FC, useContext, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { Danger } from '@shared/elements';
import {
  formatBalance,
  getMessageNotWhitelistedToken,
  getMessageNotWhitelistedTokenPair,
  getTokenInputAmountCap,
  getTokenSymbol,
  isExist,
  isNull,
  prepareTokenLogo
} from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';

import { Button } from '../button';
import { DashPlug } from '../dash-plug';
import { Scaffolding } from '../scaffolding';
import { Balance } from '../state-components/balance';
import { TokensLogos } from '../tokens-logos';
import { ComplexError } from './ComplexError';
import styles from './ComplexInput.module.scss';
import { PercentSelector } from './PercentSelector';

const DEFAULT_EXCHANGE_RATE = 0;

interface Props {
  className?: string;
  label: string;
  id: string;
  value: string;
  onInputChange: (value: string) => void;
  balance: Optional<string>;
  decimals: number;
  shouldShowBalanceButtons?: boolean;
  exchangeRate?: string;
  error?: string;
  tokenA: Nullable<Token>;
  tokenB?: Nullable<Token>;
  tokensLoading?: boolean;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TokenInput: FC<Props> = ({
  className,
  exchangeRate = null,
  label,
  id,
  value,
  onInputChange,
  balance,
  decimals,
  shouldShowBalanceButtons = true,
  error,
  tokenA,
  tokenB,
  tokensLoading
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const accountPkh = useAccountPkh();

  const dollarEquivalent = useMemo(
    () =>
      exchangeRate
        ? new BigNumber(value ? value.toString() : DEFAULT_EXCHANGE_RATE)
            .multipliedBy(new BigNumber(exchangeRate))
            .toString()
        : '',
    [exchangeRate, value]
  );

  const compoundClassName = cx(
    { [styles.focused]: isFocused, [styles.error]: !!error },
    themeClass[colorThemeMode],
    className
  );

  const focusInput = () => {
    inputRef?.current?.focus();
  };

  const equivalentContent = dollarEquivalent ? `= $ ${formatBalance(dollarEquivalent)}` : '';

  const isExistTokenA = isExist(tokenA);

  const disabled = !isExist(balance) || !isExistTokenA;
  const isBothTokensExist = isExistTokenA && isExist(tokenB);

  const getTokensSymbols = (_tokenA: Nullable<Token>, _tokenB?: Nullable<Token>) => {
    const firstTokenIcon = _tokenA ? prepareTokenLogo(_tokenA.metadata?.thumbnailUri) : null;
    const firstTokenSymbol = _tokenA ? getTokenSymbol(_tokenA) : 'TOKEN';

    const secondTokenIcon = _tokenB ? prepareTokenLogo(_tokenB.metadata?.thumbnailUri) : null;
    const secondTokenSymbol = _tokenB ? getTokenSymbol(_tokenB) : 'TOKEN';

    if (isBothTokensExist) {
      return {
        firstTokenIcon,
        firstTokenSymbol,
        secondTokenIcon,
        secondTokenSymbol,
        tokenSelectSymbol: `${firstTokenSymbol} / ${secondTokenSymbol}`
      };
    }

    return {
      firstTokenIcon,
      firstTokenSymbol,
      secondTokenIcon,
      secondTokenSymbol,
      tokenSelectSymbol: firstTokenSymbol
    };
  };

  const { firstTokenIcon, firstTokenSymbol, secondTokenIcon, secondTokenSymbol, tokenSelectSymbol } = getTokensSymbols(
    tokenA,
    tokenB
  );
  const tokenLabel = tokensLoading ? <DashPlug zoom={1.45} animation /> : tokenSelectSymbol;

  const notWhitelistedMessage =
    tokenA && tokenB
      ? getMessageNotWhitelistedTokenPair(tokenA, tokenB)
      : tokenA && getMessageNotWhitelistedToken(tokenA);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handlePercentageSelect = (newValue: string) => {
    const _value = new BigNumber(newValue).decimalPlaces(decimals).toFixed();
    onInputChange(_value);
  };

  const amountCap = isNull(tokenB) ? getTokenInputAmountCap(tokenA) : undefined;

  return (
    <div className={compoundClassName} onClick={focusInput} onKeyPress={focusInput} role="button" tabIndex={0}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.background}>
        <div className={styles.shape}>
          <div className={cx(styles.item1, styles.label2)}>{equivalentContent}</div>
          <div className={styles.item2}>{accountPkh && <Balance balance={balance} colorMode={colorThemeMode} />}</div>
          <input
            id={id}
            className={cx(styles.item3, styles.input)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={inputRef}
            value={value}
            autoComplete="off"
            disabled={disabled}
            onChange={handleInputChange}
          />
          <div className={styles.dangerContainer}>
            {notWhitelistedMessage && <Danger content={notWhitelistedMessage} />}
            <Button
              disabled={disabled}
              theme="quaternary"
              className={cx(styles.item4, styles.frozen)}
              textClassName={styles.item4Inner}
            >
              {isBothTokensExist ? (
                <TokensLogos
                  firstTokenIcon={firstTokenIcon}
                  firstTokenSymbol={firstTokenSymbol}
                  secondTokenIcon={secondTokenIcon}
                  secondTokenSymbol={secondTokenSymbol}
                />
              ) : (
                <TokensLogos firstTokenIcon={firstTokenIcon} firstTokenSymbol={firstTokenSymbol} />
              )}
              <h6 className={styles.token}>{tokenLabel}</h6>
            </Button>
          </div>
        </div>
      </div>
      <Scaffolding showChild={shouldShowBalanceButtons} className={styles.scaffoldingPercentSelector}>
        <PercentSelector amountCap={amountCap} value={balance} handleBalance={handlePercentageSelect} />
      </Scaffolding>
      <ComplexError error={error} />
    </div>
  );
};
