import React, { useRef, useMemo, useState, useContext, HTMLProps } from 'react';

import { Button, Shevron, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TokensLogos } from '@components/common/TokensLogos';
import { TokensModal } from '@components/modals/TokensModal';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { useAccountPkh } from '@utils/dapp';
import { getWhitelistedTokenSymbol, isExist, prepareTokenLogo, prettyPrice } from '@utils/helpers';
import { formatBalance } from '@utils/helpers/format-balance';
import { Nullable, WhitelistedToken } from '@utils/types';

import s from './ComplexInput.module.sass';

interface TokenSelectProps extends HTMLProps<HTMLInputElement> {
  shouldShowBalanceButtons?: boolean;
  className?: string;
  balance: Nullable<string>;
  exchangeRate?: string;
  label: string;
  error?: string;
  notSelectable?: boolean;
  handleChange?: (token: WhitelistedToken) => void;
  handleBalance: (value: string) => void;
  token: Nullable<WhitelistedToken>;
  token2?: Nullable<WhitelistedToken>;
  blackListedTokens: WhitelistedToken[];
  setToken?: (token: WhitelistedToken) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const TokenSelect: React.FC<TokenSelectProps> = ({
  className,
  balance = null,
  shouldShowBalanceButtons = true,
  label,
  handleBalance,
  exchangeRate = null,
  notSelectable = false,
  value,
  error,
  id,
  handleChange,
  token,
  token2,
  setToken,
  blackListedTokens,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [focused, setActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const account = useAccountPkh();

  const dollarEquivalent = useMemo(
    () =>
      exchangeRate
        ? new BigNumber(value ? value.toString() : 0).multipliedBy(new BigNumber(exchangeRate)).toString()
        : '',
    [exchangeRate, value]
  );

  const compoundClassName = cx({ [s.focused]: focused }, { [s.error]: !!error }, themeClass[colorThemeMode], className);

  const focusInput = () => {
    inputRef?.current?.focus();
  };

  const equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';

  const disabled = !isExist(balance) || !isExist(token);

  return (
    <>
      <div className={compoundClassName} onClick={focusInput} onKeyPress={focusInput} role="button" tabIndex={0}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)}>{equivalentContent}</div>
            <div className={s.item2}>
              {account && isExist(balance) && (
                <div className={s.item2Line}>
                  <div className={s.caption}>{t('common|Balance')}:</div>
                  <div className={cx(s.label2, s.price)}>{formatBalance(balance)}</div>
                </div>
              )}
            </div>
            <input
              className={cx(s.item3, s.input)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              ref={inputRef}
              value={value}
              autoComplete="off"
              disabled={disabled || props.disabled}
              {...props}
            />
            <Button
              disabled={notSelectable}
              onClick={() => !notSelectable && setTokensModal(true)}
              theme="quaternary"
              className={s.item4}
              textClassName={s.item4Inner}
            >
              <TokensLogos
                firstTokenIcon={token ? prepareTokenLogo(token.metadata?.thumbnailUri) : null}
                firstTokenSymbol={token ? getWhitelistedTokenSymbol(token) : 'TOKEN'}
                secondTokenIcon={token2 && prepareTokenLogo(token2.metadata.thumbnailUri)}
                secondTokenSymbol={token2 && getWhitelistedTokenSymbol(token2)}
              />
              <h6 className={cx(s.token)}>
                {token ? getWhitelistedTokenSymbol(token) : 'SELECT'}
                {token2 && ` / ${getWhitelistedTokenSymbol(token2)}`}
              </h6>
              {!notSelectable && <Shevron />}
            </Button>
          </div>
        </div>
        {shouldShowBalanceButtons && <PercentSelector value={balance} handleBalance={handleBalance} />}
        <ComplexError error={error} />
        {tokensModal && (
          <TokensModal
            blackListedTokens={blackListedTokens}
            isOpen={tokensModal}
            onRequestClose={() => setTokensModal(false)}
            onChange={selectedToken => {
              setToken?.(selectedToken);
              handleChange?.(selectedToken);
              setTokensModal(false);
            }}
          />
        )}
      </div>
    </>
  );
};
