import { ChangeEvent, FC, HTMLProps, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { Danger } from '@shared/elements';
import {
  formatBalance,
  getMessageNotWhitelistedToken,
  getTokenInputAmountCap,
  getTokenSymbol,
  isExist
} from '@shared/helpers';
import { amountsAreEqual } from '@shared/helpers/comparison';
import { Shevron } from '@shared/svg';
import { Undefined, Token } from '@shared/types';

import s from './ComplexInput.module.scss';
import { Button } from '../button';
import { ComplexError } from '../complex-error';
import { PercentSelector } from '../percent-selector';
import { Scaffolding } from '../scaffolding';
import { Balance } from '../state-components/balance';
import { TokensLogos } from '../tokens-logo';
import { TokensModal } from '../tokens-modal';

interface NewTokenSelectProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  showBalanceButtons?: boolean;
  amount?: BigNumber;
  balance?: BigNumber;
  exchangeRate?: BigNumber;
  label: string;
  error?: string;
  selectable?: boolean;
  token?: Token;
  blackListedTokens: Token[];
  id?: string;
  placeholder?: string;
  inputDisabled?: boolean;
  onAmountChange: (value: Undefined<BigNumber>) => void;
  onTokenChange: (token: Token) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const NewTokenSelect: FC<NewTokenSelectProps> = ({
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
  inputDisabled,
  onAmountChange,
  onTokenChange,
  token,
  blackListedTokens,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const account = useAccountPkh();

  const amountStr = useMemo(() => (isExist(amount) ? new BigNumber(amount).toFixed() : ''), [amount]);
  const tokenDecimals = token?.metadata.decimals;

  const [localAmount, setLocalAmount] = useState(amountStr);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setLocalAmount(amountStr);
  }, [amountStr]);

  const dollarEquivalent = useMemo(
    () => exchangeRate && (amount ?? new BigNumber(0)).times(new BigNumber(exchangeRate)).decimalPlaces(2).toString(),
    [exchangeRate, amount]
  );

  const compoundClassName = cx({ [s.focused]: focused }, { [s.error]: !!error }, themeClass[colorThemeMode], className);

  const inputClassName = cx(s.item3, s.input, { [s.disabled]: inputDisabled });

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

  const handleAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const val = evt.target.value.replace(/ /g, '').replace(/,/g, '.');
    const numVal = new BigNumber(val || 0);

    if (!numVal.isNaN() && numVal.gte(0)) {
      setLocalAmount(val);
      handleAmountChangeIfNeeded(val === '' ? undefined : numVal);
    }
  };

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const equivalentContent = dollarEquivalent ? `= $ ${formatBalance(dollarEquivalent)}` : '';

  const handleTokenChange = (selectedToken: Token) => {
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

  const notWhitelistedMessage = token ? getMessageNotWhitelistedToken(token) : null;

  return (
    <div {...props}>
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
              className={inputClassName}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
              value={localAmount}
              disabled={inputDisabled}
              autoComplete="off"
              onChange={handleAmountChange}
              placeholder={placeholder}
              data-test-id="input"
            />
            <div className={s.dangerContainer}>
              {notWhitelistedMessage && <Danger content={notWhitelistedMessage} />}
              <Button
                disabled={!selectable}
                onClick={() => selectable && setTokensModal(true)}
                theme="quaternary"
                className={s.item4}
                textClassName={s.item4Inner}
                data-test-id="changeToken"
              >
                <TokensLogos tokens={token ?? null} />
                <h6 className={cx(s.token)}>{token ? getTokenSymbol(token) : 'SELECT'}</h6>
                {selectable && <Shevron />}
              </Button>
            </div>
          </div>
        </div>
        <Scaffolding showChild={showBalanceButtons} className={s.scaffoldingPercentSelector}>
          <PercentSelector
            value={balance?.toFixed() ?? '0'}
            handleBalance={handlePercentageSelect}
            amountCap={getTokenInputAmountCap(token)}
            inputName={`newTokenSelect-${id}`}
          />
        </Scaffolding>
        <ComplexError error={error} data-test-id="error" />
      </div>
    </div>
  );
};
