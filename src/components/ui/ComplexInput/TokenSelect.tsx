import React, { useContext, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { prettyPrice } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { TokensModal } from '@components/modals/TokensModal';
import { TokensLogos } from '@components/ui/TokensLogos';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { Shevron } from '@components/svg/Shevron';

import s from './ComplexInput.module.sass';

type TokenSelectProps = {
  className?: string
  balance?: string
  label: string
  error?: string
  handleChange?: (token:WhitelistedToken) => void
  mode?: keyof typeof modeClass
  handleBalance: (value: string) => void
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  input: s.inputMode,
  select: s.selectMode,
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenSelect: React.FC<TokenSelectProps> = ({
  className,
  balance = '10.00',
  label,
  handleBalance,
  value,
  error,
  id,
  mode = 'input',
  handleChange,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = React.useState<boolean>(false);
  const [token, setToken] = React.useState<WhitelistedToken>();
  const [focused, setActive] = React.useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: Change logic of buttons and dollar during connection to SDK
  const dollarEquivalent = useMemo(() => (parseFloat(value ? value.toString() : '0') * 3).toString(), [value]);

  const compoundClassName = cx(
    { [s.focused]: focused },
    { [s.error]: !!error },
    themeClass[colorThemeMode],
    className,
  );

  // const focusInput = () => {
  //   if (inputRef?.current) {
  //     inputRef.current.focus();
  //   }
  // };

  const equivalentContent = mode === 'input' ? `= $ ${prettyPrice(parseFloat(dollarEquivalent || '0'))}` : '';

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={compoundClassName}
      // onClick={focusInput}
    >
      <TokensModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={(selectedToken) => {
          setToken(selectedToken);
          if (handleChange) handleChange(selectedToken);
          setTokensModal(false);
        }}
      />
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={s.background}>
        <div className={s.shape}>
          <div className={cx(s.item1, s.label2)}>
            {equivalentContent}
          </div>
          <div className={s.item2}>
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
            <TokensLogos token1={token} />
            <h6 className={cx(s.token)}>
              {token?.metadata.symbol}
            </h6>
            <Shevron />
          </Button>
        </div>
      </div>
      <PercentSelector value={balance} handleBalance={handleBalance} />
      <ComplexError error={error} />
    </div>
  );
};
