import React, { useRef, useMemo, useContext, useState, FC, HTMLProps } from 'react';

import { Shevron, ColorModes, TokensLogos, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { getWhitelistedTokenSymbol, prepareTokenLogo, prettyPrice } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

import { Button } from '../elements/button';
import s from './ComplexInput.module.sass';

const modeClass = {
  input: s.inputMode,
  select: s.selectMode,
  votes: s.votesMode
};

interface ComplexInputProps extends HTMLProps<HTMLInputElement> {
  className?: string;
  balance?: string;
  exchangeRate?: string;
  label: string;
  error?: string;
  onClick?: () => void;
  token1: WhitelistedToken;
  token2?: WhitelistedToken;
  mode?: keyof typeof modeClass;
  decimals?: number;
  handleBalance?: (value: string) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const ComplexInput: FC<ComplexInputProps> = ({
  className,
  balance,
  label,
  handleBalance,
  exchangeRate = null,
  value,
  readOnly,
  error,
  id,
  mode = 'input',
  onClick,
  token1,
  token2,
  decimals = 6,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dollarEquivalent = useMemo(
    () =>
      exchangeRate
        ? new BigNumber(value ? value.toString() : 0).multipliedBy(new BigNumber(exchangeRate)).toString()
        : '',
    [exchangeRate, value]
  );

  const compoundClassName = cx(
    { [s.focused]: focused },
    { [s.error]: !readOnly && !!error },
    { [s.readOnly]: readOnly },
    themeClass[colorThemeMode],
    className
  );

  const focusInput = () => {
    if (inputRef?.current && !readOnly) {
      inputRef.current.focus();
    }
  };

  let equivalentContent = '';
  if (mode === 'input') {
    equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';
  }

  return (
    <div className={compoundClassName} onClick={focusInput}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={s.background}>
        <div className={s.shape}>
          <div className={cx(s.item1, s.label2)}>{equivalentContent}</div>
          <div className={s.item2}>
            {mode === 'select' && (
              <div className={s.item2Line}>
                <div className={s.caption}>{t('common|Frozen Balance')}:</div>
                <div className={cx(s.label2, s.price)}>{balance && prettyPrice(parseFloat(balance), decimals)}</div>
              </div>
            )}
            <div className={s.item2Line}>
              <div className={s.caption}>{t('common|Total Balance')}:</div>
              <div className={cx(s.label2, s.price)}>{balance && prettyPrice(parseFloat(balance), decimals)}</div>
            </div>
          </div>
          <input
            className={cx(s.item3, s.input)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            ref={inputRef}
            readOnly={readOnly}
            value={value}
            {...props}
          />
          <Button
            onClick={onClick}
            theme="quaternary"
            className={s.item4}
            textClassName={s.item4Inner}
            disabled={readOnly}
          >
            <TokensLogos
              firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
              firstTokenSymbol={getWhitelistedTokenSymbol(token1)}
              secondTokenIcon={token2 && prepareTokenLogo(token2.metadata?.thumbnailUri)}
              secondTokenSymbol={token2 && getWhitelistedTokenSymbol(token2)}
            />
            <h6 className={cx(s.token)}>
              {mode === 'input' && getWhitelistedTokenSymbol(token1)}
              {mode === 'select' && 'TOKEN / TOKEN'}
              {mode === 'votes' && 'SELECT LP'}
            </h6>
            {!readOnly && <Shevron />}
          </Button>
        </div>
      </div>
      {balance && !readOnly && handleBalance && <PercentSelector value={balance} handleBalance={handleBalance} />}
      {!readOnly && <ComplexError error={error} />}
    </div>
  );
};
