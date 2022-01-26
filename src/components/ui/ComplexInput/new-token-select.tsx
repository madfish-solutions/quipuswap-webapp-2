import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Shevron, ColorModes, TokensLogos, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { TEZOS_TOKEN } from '@app.config';
import { TokensModal } from '@components/modals/TokensModal';
import { Scaffolding } from '@components/scaffolding';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { useAccountPkh } from '@utils/dapp';
import { amountsAreEqual, getWhitelistedTokenSymbol, isExist, prepareTokenLogo, prettyPrice } from '@utils/helpers';
import { Undefined, WhitelistedToken } from '@utils/types';

import { Button } from '../elements/button';
import { Balance } from '../state-components/balance';
import s from './ComplexInput.module.sass';

interface NewTokenSelectProps {
  className?: string;
  showBalanceButtons?: boolean;
  amount?: BigNumber;
  balance?: BigNumber;
  exchangeRate?: BigNumber;
  label: string;
  error?: string;
  selectable?: boolean;
  token?: WhitelistedToken;
  blackListedTokens: WhitelistedToken[];
  id?: string;
  placeholder?: string;
  onAmountChange: (value: Undefined<BigNumber>) => void;
  onTokenChange: (token: WhitelistedToken) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const NewTokenSelect: React.FC<NewTokenSelectProps> = ({
  amount,
  className,
  balance,
  showBalanceButtons = true,
  label,
  exchangeRate,
  selectable = true,
  error,
  id,
  placeholder,
  onAmountChange,
  onTokenChange,
  token,
  blackListedTokens
}) => {
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

  const handleAmountChangeIfNeeded = (newAmount: Undefined<BigNumber>) => {
    if (!amountsAreEqual(newAmount, amount)) {
      onAmountChange(newAmount);
    }
  };

  const handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const val = evt.target.value.replace(/ /g, '').replace(/,/g, '.');
    const numVal = new BigNumber(val || 0);

    if (!numVal.isNaN() && numVal.gte(0)) {
      setLocalAmount(val);
      handleAmountChangeIfNeeded(val === '' ? undefined : numVal);
    }
  };

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';

  const handleTokenChange = (selectedToken: WhitelistedToken) => {
    setTokensModal(false);
    const val = localAmount.replace(/ /g, '').replace(/,/g, '.');
    const numVal = new BigNumber(val || 0);
    if (!numVal.isNaN() && numVal.gte(0) && val !== '') {
      setLocalAmount(numVal.decimalPlaces(selectedToken.metadata.decimals).toFixed());
    }
    onTokenChange(selectedToken);
  };

  const handlePercentageSelect = (state: string) => {
    const newValue = new BigNumber(state).decimalPlaces(tokenDecimals ?? 3);
    setLocalAmount(newValue.toFixed());
    handleAmountChangeIfNeeded(newValue);
  };

  const preparedBalance = isExist(tokenDecimals) && isExist(balance) ? balance.toFixed(tokenDecimals) : null;

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
            <div className={s.item2}>{account && <Balance balance={preparedBalance} colorMode={colorThemeMode} />}</div>
            <input
              className={cx(s.item3, s.input)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
              value={localAmount}
              autoComplete="off"
              onChange={handleAmountChange}
              placeholder={placeholder}
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
        <Scaffolding showChild={showBalanceButtons} className={s.scaffoldingPercentSelector}>
          <PercentSelector value={balance?.toFixed() ?? '0'} handleBalance={handlePercentageSelect} />
        </Scaffolding>
        <ComplexError error={error} />
      </div>
    </>
  );
};
