import React, { useRef, useState, useContext, HTMLProps, FC } from 'react';

import { Button, Shevron, ColorModes, TokensLogos, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { PositionsModal } from '@components/modals/PositionsModal';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol, prepareTokenLogo, prettyPrice } from '@utils/helpers';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import s from './ComplexInput.module.sass';

interface PositionSelectProps extends HTMLProps<HTMLInputElement> {
  noBalanceButtons?: boolean;
  className?: string;
  balance?: string;
  balanceLabel?: string;
  frozenBalance?: string;
  notFrozen?: boolean;
  label: string;
  error?: string;
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
  handleChange?: (tokenPair: WhitelistedTokenPair) => void;
  handleBalance: (value: string) => void;
  tokenPair: Nullable<WhitelistedTokenPair>;
  setTokenPair: (tokenPair: WhitelistedTokenPair) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PositionSelect: FC<PositionSelectProps> = ({
  className,
  balance = '10.00',
  noBalanceButtons = false,
  frozenBalance = '10.00',
  label,
  balanceLabel,
  handleBalance,
  value,
  error,
  id,
  handleChange,
  notSelectable1 = undefined,
  notSelectable2 = undefined,
  tokenPair,
  setTokenPair,
  notFrozen,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [focused, setActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compoundClassName = cx({ [s.focused]: focused }, { [s.error]: !!error }, themeClass[colorThemeMode], className);

  const focusInput = () => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  const token1 = tokenPair?.token1 ?? TEZOS_TOKEN;
  const token2 = tokenPair?.token2 ?? TEZOS_TOKEN;

  return (
    <>
      <PositionsModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={selectedToken => {
          setTokenPair(selectedToken);
          if (handleChange) {
            handleChange(selectedToken);
          }
          setTokensModal(false);
        }}
        initialPair={tokenPair}
        notSelectable1={notSelectable1}
        notSelectable2={notSelectable2}
      />
      <div className={compoundClassName} onClick={focusInput}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)} />
            <div className={s.item2}>
              {notFrozen ? (
                ''
              ) : (
                <div className={s.item2Line}>
                  <div className={s.caption}>{t('common|Frozen Balance')}:</div>
                  <div className={cx(s.label2, s.price)}>{prettyPrice(parseFloat(frozenBalance))}</div>
                </div>
              )}
              {!noBalanceButtons ? (
                <div className={s.item2Line}>
                  <div className={s.caption}>{balanceLabel ?? t('common|Total Balance')}:</div>
                  <div className={cx(s.label2, s.price)}>{prettyPrice(parseFloat(balance))}</div>
                </div>
              ) : (
                <div className={s.item2Line} />
              )}
            </div>
            <input
              autoComplete="off"
              className={cx(s.item3, s.input)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              ref={inputRef}
              value={value}
              placeholder="0.0"
              autoFocus
              {...props}
            />
            <Button
              onClick={() => setTokensModal(true)}
              theme="quaternary"
              className={s.item4}
              textClassName={s.item4Inner}
            >
              <TokensLogos
                firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
                firstTokenSymbol={getWhitelistedTokenSymbol(token1)}
                secondTokenIcon={prepareTokenLogo(token2.metadata?.thumbnailUri)}
                secondTokenSymbol={getWhitelistedTokenSymbol(token2)}
              />
              <h6 className={cx(s.token)}>
                {tokenPair
                  ? `${getWhitelistedTokenSymbol(tokenPair.token1, 5)} / ${getWhitelistedTokenSymbol(
                      tokenPair.token2,
                      5
                    )}`
                  : 'Select LP'}
              </h6>
              <Shevron />
            </Button>
          </div>
        </div>
        {!noBalanceButtons && <PercentSelector value={balance} handleBalance={handleBalance} />}
        <ComplexError error={error} />
      </div>
    </>
  );
};
