import React, { useContext, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { prettyPrice } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { Shevron } from '@components/svg/Shevron';

import s from './ComplexInput.module.sass';

type ComplexInputProps = {
  className?: string
  balance?: string
  label: string
  error?: string
  onClick?: () => void
  token1: WhitelistedToken
  token2?: WhitelistedToken
  mode?: keyof typeof modeClass
  handleBalance?: (value: string) => void
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  input: s.inputMode,
  select: s.selectMode,
  votes: s.votesMode,
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexInput: React.FC<ComplexInputProps> = ({
  className,
  balance = '10.00',
  label,
  handleBalance,
  value,
  readOnly,
  error,
  id,
  mode = 'input',
  onClick,
  token1,
  token2,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: Change logic of buttons and dollar during connection to SDK
  const dollarEquivalent = useMemo(() => (parseFloat(value ? value.toString() : '0') * 3).toString(), [value]);

  const compoundClassName = cx(
    { [s.focused]: focused },
    { [s.error]: !readOnly && !!error },
    { [s.readOnly]: readOnly },
    themeClass[colorThemeMode],
    className,
  );

  const focusInput = () => {
    if (inputRef?.current && !readOnly) {
      inputRef.current.focus();
    }
  };

  const equivalentContent = mode === 'input' ? `= $ ${prettyPrice(parseFloat(dollarEquivalent || '0'))}` : '';

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
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
            {mode === 'select' && (
            <div className={s.item2Line}>
              <div className={s.caption}>
                {t('common:Frozen Balance')}
                :
              </div>
              <div className={cx(s.label2, s.price)}>
                {prettyPrice(parseFloat(balance))}
              </div>

            </div>
            )}
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
            readOnly={readOnly}
            value={value}
            {...props}
          />
          <Button onClick={onClick} theme="quaternary" className={s.item4} disabled={readOnly}>
            <TokensLogos token1={token1} token2={token2} />
            <h6 className={cx(s.token)}>
              {mode === 'input' && token1?.metadata?.symbol}
              {mode === 'select' && 'TOKEN / TOKEN'}
              {mode === 'votes' && 'SELECT LP'}
            </h6>
            {!readOnly && (<Shevron />)}
          </Button>
        </div>
      </div>
      {
        !readOnly
        && handleBalance && (<PercentSelector value={balance} handleBalance={handleBalance} />)
      }
      {!readOnly && (<ComplexError error={error} />)}
    </div>
  );
};
