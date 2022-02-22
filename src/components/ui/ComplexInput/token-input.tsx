import { ChangeEvent, FC, useContext, useMemo, useRef, useState } from 'react';

import { ColorModes, ColorThemeContext, Shevron } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { TokensLogos } from '@components/common/TokensLogos';
import { Scaffolding } from '@components/scaffolding';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { useAccountPkh } from '@utils/dapp';
import {
  getMessageNotWhitelistedToken,
  getTokenInputAmountCap,
  getTokenSymbol,
  isExist,
  prepareTokenLogo,
  prettyPrice
} from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

import { Danger } from '../components/danger';
import { DashPlug } from '../dash-plug';
import { Button } from '../elements/button';
import { Balance } from '../state-components/balance';
import styles from './ComplexInput.module.sass';

const DEFAULT_EXCHANGE_RATE = 0;

interface Props {
  className?: string;
  label: string;
  id: string;
  value: string;
  onInputChange: (value: string) => void;
  balance: Nullable<string>;
  shouldShowBalanceButtons?: boolean;
  exchangeRate?: string;
  error?: string;
  notSelectable?: boolean;
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
  balance = null,
  shouldShowBalanceButtons = true,
  notSelectable = false,
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

  const equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';

  const isExistTokenA = isExist(tokenA);

  const disabled = !isExist(balance) || !isExistTokenA;
  const isBothTokensExist = isExistTokenA && isExist(tokenB);

  const getTokensSymbols = (tokenA: Nullable<Token>, tokenB?: Nullable<Token>) => {
    const firstTokenIcon = tokenA ? prepareTokenLogo(tokenA.metadata?.thumbnailUri) : null;
    const firstTokenSymbol = tokenA ? getTokenSymbol(tokenA) : 'TOKEN';

    const secondTokenIcon = tokenB ? prepareTokenLogo(tokenB.metadata?.thumbnailUri) : null;
    const secondTokenSymbol = tokenB ? getTokenSymbol(tokenB) : 'TOKEN';

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

  const notWhitelistedMessageA = tokenA ? getMessageNotWhitelistedToken(tokenA) : null;
  const notWhitelistedMessageB = tokenB ? getMessageNotWhitelistedToken(tokenB) : null;

  const notWhitelistedMessage = `${notWhitelistedMessageA ? notWhitelistedMessageA : ''} ${
    notWhitelistedMessageB ? notWhitelistedMessageB : ''
  }`;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

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
              disabled={notSelectable}
              theme="quaternary"
              className={styles.item4}
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
              {!notSelectable && <Shevron />}
            </Button>
          </div>
        </div>
      </div>
      {onInputChange ? (
        <Scaffolding showChild={shouldShowBalanceButtons} className={styles.scaffoldingPercentSelector}>
          <PercentSelector amountCap={getTokenInputAmountCap(tokenA)} value={balance} handleBalance={onInputChange} />
        </Scaffolding>
      ) : null}
      <ComplexError error={error} />
    </div>
  );
};
