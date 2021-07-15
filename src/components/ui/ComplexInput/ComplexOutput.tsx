import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import Token from '@icons/Token.svg';

import s from './ComplexInput.module.sass';

type ComplexOutputProps = {
  className?: string,
  balance?: string,
  value?: string,
  label?:string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexOutput: React.FC<ComplexOutputProps> = ({
  className,
  balance = '10.00',
  value = '10.00',
  label,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const viewValue = value;

  const convertValue = value + 1;

  return (
    <div className={cx(modeClass[colorThemeMode], className)}>
      <div className={s.label}>{label}</div>
      <div className={s.shape}>
        <div className={cx(s.item1, s.label2)}>
          = $
          {' '}
          {convertValue}
        </div>
        <div className={cx(s.item2)}>
          <div className={s.caption}>
            {t('common:Balance')}
            :
          </div>
          <div className={cx(s.label2, s.price)}>
            {prettyPrice(parseFloat(balance))}
          </div>
        </div>

        <div
          className={cx(s.item3, s.output)}
        >
          {viewValue}
        </div>
        <div className={cx(s.item4)}>
          <Token />
          <h6 className={cx(s.token)}>
            TOKEN
          </h6>
        </div>
      </div>
    </div>
  );
};
