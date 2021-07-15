import React, { useContext, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { Shevron } from '@components/svg/Shevron';
import Token from '@icons/Token.svg';

import s from './ComplexInput.module.sass';

type ComplexInputProps = {
  className?: string
  balance?: string
  label: string
  error?: string
  handleBalance?: (value: string) => void
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
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
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: Change logic of buttons and dollar when connect to SDK
  const dollarEquivalent = useMemo(() => (parseFloat(value ? value.toString() : '0') * 3).toString(), [value]);

  const compoundClassName = cx(
    { [s.focused]: focused },
    { [s.error]: !readOnly && !!error },
    { [s.readOnly]: readOnly },
    modeClass[colorThemeMode],
    className,
  );

  const focusInput = () => {
    if (inputRef?.current && !readOnly) {
      inputRef.current.focus();
    }
  };

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
            = $
            {' '}
            {prettyPrice(parseFloat(dollarEquivalent || '0'))}
          </div>
          <div className={cx(s.item2)}>
            <span className={s.caption}>
              {t('common:Total Balance')}
              :
            </span>
            <span className={cx(s.label2, s.price)}>
              {prettyPrice(parseFloat(balance))}
            </span>
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
          <Button theme="quaternary" className={s.item4} disabled={readOnly}>
            <Token />
            <h6 className={cx(s.token)}>
              TOKEN
            </h6>
            {!readOnly && (<Shevron />)}
          </Button>
        </div>
      </div>
      {!readOnly && handleBalance && (
        <div className={s.controls}>
          <Button
            theme="quaternary"
            onClick={() => handleBalance((parseFloat(balance) * 0.25).toString())}
            className={s.btn}
          >
            25%
          </Button>
          <Button
            theme="quaternary"
            onClick={() => handleBalance((parseFloat(balance) * 0.5).toString())}
            className={s.btn}
          >
            50%
          </Button>
          <Button
            theme="quaternary"
            onClick={() => handleBalance((parseFloat(balance) * 0.75).toString())}
            className={s.btn}
          >
            75%
          </Button>
          <Button
            theme="quaternary"
            onClick={() => handleBalance(balance)}
            className={s.btn}
          >
            MAX
          </Button>
        </div>
      )}
      {
        !readOnly && (
          <div className={s.errorContainer}>
            <p className={cx(s.errorLabel)}>
              {error}
            </p>
          </div>
        )
      }
    </div>
  );
};
