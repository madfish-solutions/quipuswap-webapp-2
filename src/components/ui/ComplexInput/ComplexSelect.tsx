import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { Shevron } from '@components/svg/Shevron';
import Token from '@icons/Token.svg';

import { Button } from '../Button';
import { PercentSelector } from './PercentSelector';
import { ComplexError } from './ComplexError';

import s from './ComplexInput.module.sass';

type ComplexSelectProps = {
  className?: string,
  balance?: string,
  label?:string,
  error?:string,
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexSelect: React.FC<ComplexSelectProps> = ({
  className,
  balance = '10.00',
  label,
  error,
  id,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);
  const [value, onChange] = React.useState<string>('');

  const viewValue = value!!;

  const compoundClassName = cx(
    { [s.focused]: focused },
    { [s.error]: error },
    modeClass[colorThemeMode],
    className,
  );

  return (
    <div
      tabIndex={-1}
      className={compoundClassName}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.background}>

        <div className={s.shape}>
          <div className={cx(s.item1, s.label2)} />
          <div className={cx(s.item2Block)}>
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
            {...props}
            value={viewValue}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          />
          <Button onMouseDown={(e:React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); e.stopPropagation(); }} theme="quaternary" className={cx(s.item4)}>
            <div className={s.tokenGroup}>
              <Token />
            </div>
            <Token />
            <h6 className={cx(s.token)}>
              LP TOKEN
            </h6>
            <Shevron />
          </Button>
        </div>
      </div>
      <PercentSelector value={balance} onChange={onChange} />
      <ComplexError error={error} />
    </div>
  );
};
