import React, {
  useContext, useMemo, useRef, useState,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { WhitelistedToken } from '@utils/types';
import { getWhitelistedTokenSymbol, prettyPrice, prettyPriceThousands } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { TokensModal } from '@components/modals/TokensModal';
import { TokensLogos } from '@components/ui/TokensLogos';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { Shevron } from '@components/svg/Shevron';

import { TEZOS_TOKEN } from '@utils/defaults';
import { useAccountPkh } from '@utils/dapp';
import BigNumber from 'bignumber.js';
import s from './ComplexInput.module.sass';

type TokenSelectProps = {
  noBalanceButtons?: boolean
  className?: string
  balance: string
  exchangeRate?: string
  label: string
  error?: string
  notSelectable?: boolean
  handleChange?: (token:WhitelistedToken) => void
  handleBalance: (value: string) => void
  token?: WhitelistedToken,
  blackListedTokens: WhitelistedToken[],
  setToken: (token:WhitelistedToken) => void
} & React.HTMLProps<HTMLInputElement>;

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenSelect: React.FC<TokenSelectProps> = ({
  className,
  balance = '0',
  noBalanceButtons = false,
  label,
  handleBalance,
  exchangeRate = null,
  notSelectable = false,
  value,
  error,
  id,
  handleChange,
  token,
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

  const dollarEquivalent = useMemo(() => (exchangeRate
    ? new BigNumber(value ? value.toString() : 0)
      .times(new BigNumber(exchangeRate))
      .toString()
    : ''
  ),
  [exchangeRate, value]);

  const compoundClassName = cx(
    { [s.focused]: focused },
    { [s.error]: !!error },
    themeClass[colorThemeMode],
    className,
  );

  const focusInput = () => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  const equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';

  return (
    <>
      <TokensModal
        blackListedTokens={blackListedTokens}
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={(selectedToken) => {
          setToken(selectedToken);
          if (handleChange) handleChange(selectedToken);
          setTokensModal(false);
        }}
      />
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={compoundClassName}
        onClick={focusInput}
      >
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)}>
              {equivalentContent}
            </div>
            <div className={s.item2}>
              {account && (
              <div className={s.item2Line}>
                <div className={s.caption}>
                  {t('common|Balance')}
                  :
                </div>
                <div className={cx(s.label2, s.price)}>
                  {prettyPriceThousands(parseFloat(balance), token?.metadata.decimals ?? 3, 6)}
                </div>
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
              {...props}
            />
            <Button
              disabled={notSelectable}
              onClick={() => !notSelectable && setTokensModal(true)}
              theme="quaternary"
              className={s.item4}
              textClassName={s.item4Inner}
            >
              <TokensLogos token1={token ?? TEZOS_TOKEN} />
              <h6 className={cx(s.token)}>

                {token ? getWhitelistedTokenSymbol(token) : 'SELECT'}
              </h6>
              {!notSelectable && (<Shevron />)}
            </Button>
          </div>
        </div>
        {!noBalanceButtons && (<PercentSelector value={balance} handleBalance={handleBalance} />)}
        <ComplexError error={error} />
      </div>
    </>
  );
};
