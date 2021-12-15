import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Shevron, ColorModes, TokensLogos, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TokensModal } from '@components/modals/TokensModal';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { useAccountPkh } from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol, prepareTokenLogo, prettyPrice } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

import s from './ComplexInput.module.sass';

interface NewTokenSelectProps {
  showBalanceButtons?: boolean;
  amount?: BigNumber;
  className?: string;
  balance?: BigNumber;
  maxValue?: BigNumber;
  exchangeRate?: BigNumber;
  label: string;
  error?: string;
  selectable?: boolean;
  onAmountChange: (value?: BigNumber) => void;
  token?: WhitelistedToken;
  blackListedTokens: WhitelistedToken[];
  onTokenChange: (token: WhitelistedToken) => void;
  id?: string;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const NO_ELEMENT_FOUND_INDEX = -1;

export const NewTokenSelect: React.FC<NewTokenSelectProps> = ({
  amount,
  className,
  balance,
  maxValue = balance,
  showBalanceButtons = true,
  label,
  exchangeRate,
  selectable = true,
  error,
  id,
  onAmountChange,
  onTokenChange,
  token,
  blackListedTokens
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const account = useAccountPkh();

  const amountStr = useMemo(() => (amount === undefined ? '' : new BigNumber(amount).toFixed()), [amount]);
  const tokenDecimals = token?.metadata.decimals;

  const [localAmount, setLocalAmount] = useState(amountStr);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setLocalAmount(amountStr);
    }
  }, [focused, amountStr]);

  const dollarEquivalent = useMemo(
    () => exchangeRate && (amount ?? new BigNumber(0)).times(new BigNumber(exchangeRate)).decimalPlaces(2).toString(),
    [exchangeRate, amount]
  );

  const compoundClassName = cx({ [s.focused]: focused }, { [s.error]: !!error }, themeClass[colorThemeMode], className);

  const focusInput = useCallback(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAmountChange = useCallback(
    evt => {
      let val = evt.target.value.replace(/ /g, '').replace(/,/g, '.');
      let numVal = new BigNumber(val || 0);
      const indexOfDot = val.indexOf('.');
      const assetDecimals = tokenDecimals ?? Infinity;
      if (indexOfDot !== NO_ELEMENT_FOUND_INDEX && val.length - indexOfDot > assetDecimals + 1) {
        val = val.substring(0, indexOfDot + assetDecimals + 1);
        numVal = new BigNumber(val);
      }

      if (!numVal.isNaN() && numVal.gte(0)) {
        setLocalAmount(val);
        onAmountChange(val === '' ? undefined : numVal);
      }
    },
    [onAmountChange, tokenDecimals]
  );

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';

  const handleTokenChange = useCallback(
    (selectedToken: WhitelistedToken) => {
      setTokensModal(false);
      let val = localAmount.replace(/ /g, '').replace(/,/g, '.');
      let numVal = new BigNumber(val || 0);
      if (!numVal.isNaN() && numVal.gte(0) && val !== '') {
        val = numVal.decimalPlaces(selectedToken.metadata.decimals).toFixed();
        numVal = new BigNumber(val);
        setLocalAmount(val);
        onAmountChange(numVal);
      }
      onTokenChange(selectedToken);
    },
    [onTokenChange, onAmountChange, localAmount]
  );

  const handlePercentageSelect = useCallback(
    (state: string) => {
      const newValue = new BigNumber(state).decimalPlaces(tokenDecimals ?? 3);
      setLocalAmount(newValue.toFixed());
      onAmountChange(newValue);
    },
    [onAmountChange, tokenDecimals]
  );

  const formattedBalance = useMemo(() => {
    if (!balance) {
      return balance;
    }
    const correctBalance = balance.decimalPlaces(tokenDecimals ?? 3);
    if (balance.eq(0)) {
      return balance.toFixed();
    }
    const integerLog = Math.floor(Math.log10(correctBalance.toNumber()));
    const decimalPlaces = integerLog >= 0 ? Math.max(0, 6 - integerLog) : Math.max(6, -integerLog + 1);

    return correctBalance.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN).toFixed();
  }, [balance, tokenDecimals]);

  return (
    <>
      <TokensModal
        blackListedTokens={blackListedTokens}
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={handleTokenChange}
      />
      <div className={compoundClassName} onClick={focusInput} onKeyPress={focusInput} tabIndex={0} role="button">
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)}>{equivalentContent}</div>
            <div className={s.item2}>
              {account && (
                <div className={s.item2Line}>
                  <div className={s.caption}>{t('common|Balance')}:</div>
                  <div className={cx(s.label2, s.price)}>{formattedBalance}</div>
                </div>
              )}
            </div>
            <input
              className={cx(s.item3, s.input)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
              value={localAmount}
              autoComplete="off"
              onChange={handleAmountChange}
            />
            <Button
              disabled={!selectable}
              onClick={() => selectable && setTokensModal(true)}
              theme="quaternary"
              className={s.item4}
              textClassName={s.item4Inner}
            >
              <TokensLogos
                firstTokenIcon={
                  token
                    ? prepareTokenLogo(token.metadata?.thumbnailUri)
                    : prepareTokenLogo(TEZOS_TOKEN.metadata.thumbnailUri)
                }
                firstTokenSymbol={token ? getWhitelistedTokenSymbol(token) : getWhitelistedTokenSymbol(TEZOS_TOKEN)}
              />
              <h6 className={cx(s.token)}>{token ? getWhitelistedTokenSymbol(token) : 'SELECT'}</h6>
              {selectable && <Shevron />}
            </Button>
          </div>
        </div>
        {showBalanceButtons && (
          <PercentSelector value={maxValue?.toString() ?? '0'} handleBalance={handlePercentageSelect} />
        )}
        <ComplexError error={error} />
      </div>
    </>
  );
};
