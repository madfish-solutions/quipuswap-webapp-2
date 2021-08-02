import React, {
  useContext, useRef, useState,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { getWhitelistedTokenSymbol, prettyPrice } from '@utils/helpers';
import { WhitelistedTokenPair } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { Shevron } from '@components/svg/Shevron';

import { PositionsModal } from '@components/modals/PositionsModal';
import { TEZOS_TOKEN } from '@utils/defaults';
import s from './ComplexInput.module.sass';

  type PositionSelectProps = {
    className?: string
    balance?: string
    label: string
    error?: string
    handleChange?: (tokenPair:WhitelistedTokenPair) => void
    handleBalance: (value: string) => void
    tokenPair?: WhitelistedTokenPair,
    setTokenPair: (tokenPair:WhitelistedTokenPair) => void
  } & React.HTMLProps<HTMLInputElement>;

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PositionSelect: React.FC<PositionSelectProps> = ({
  className,
  balance = '10.00',
  label,
  handleBalance,
  value,
  error,
  id,
  handleChange,
  tokenPair,
  setTokenPair,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [focused, setActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <PositionsModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={(selectedToken) => {
          setTokenPair(selectedToken);
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
            <div className={cx(s.item1, s.label2)} />
            <div className={s.item2}>
              <div className={s.item2Line}>
                <div className={s.caption}>
                  {t('common:Frozen Balance')}
                  :
                </div>
                <div className={cx(s.label2, s.price)}>
                  {prettyPrice(parseFloat(balance))}
                </div>

              </div>
              <div className={s.item2Line}>
                <div className={s.caption}>
                  {t('common:Total Balance')}
                  :
                </div>
                <div className={cx(s.label2, s.price)}>
                  {prettyPrice(parseFloat(balance))}
                </div>
              </div>
            </div>
            <input
              className={cx(s.item3, s.input)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              ref={inputRef}
              value={value}
              {...props}
            />
            <Button onClick={() => setTokensModal(true)} theme="quaternary" className={s.item4}>
              <TokensLogos
                token1={tokenPair?.token1 ?? TEZOS_TOKEN}
                token2={tokenPair?.token2 ?? TEZOS_TOKEN}
              />
              <h6 className={cx(s.token)}>
                {tokenPair ? `${getWhitelistedTokenSymbol(tokenPair.token1)} / ${getWhitelistedTokenSymbol(tokenPair.token2)}` : 'Select LP'}
              </h6>
              <Shevron />
            </Button>
          </div>
        </div>
        <PercentSelector value={balance} handleBalance={handleBalance} />
        <ComplexError error={error} />
      </div>
    </>
  );
};
