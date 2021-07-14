import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import React, { useContext, useState } from 'react';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import Token from '@icons/Token.svg';

import { Shevron } from '@components/svg/Shevron';
import s from './ComplexInput.module.sass';

type ComplexInputProps = {
  className?: string,
  balance?: string,
  label?:string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexInput: React.FC<ComplexInputProps> = ({
  className,
  balance = '0.00',
  label,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [value, setValue] = useState(0);

  // const viewValue = new Intl.NumberFormat('en-US').format(value ? parseInt(value, 10) : 0);
  const viewValue = value;

  const convertValue = value + 1;

  return (
    <div className={cx(modeClass[colorThemeMode], className)}>
      <div className={s.label}>{label}</div>
      <div className={s.shape}>
        <div className={cx(s.flex, s.centerRow, s.splitRow, s.topRow)}>
          <div className={s.label2}>
            = $
            {' '}
            {convertValue}
          </div>
          <div className={s.flex}>
            <div className={s.caption}>
              {t('common:Balance')}
              :
            </div>
            <div className={cx(s.label2, s.fWhite, s.mleft8)}>
              {balance}
            </div>
          </div>

        </div>
        <div className={cx(s.flex, s.centerRow, s.splitRow, s.botRow)}>
          <input className={s.input} value={viewValue} onChange={(e) => setValue(e.target.value)} />
          <div className={cx(s.flex, s.centerRow)}>
            <Token />
            <h6 className={cx(s.mleft8)}>
              TOKEN
            </h6>
            <Shevron />
          </div>
        </div>
      </div>
      <div className={cx(s.mleft16, s.flex, s.centerRow, s.mtop8)}>
        <div className={s.btn}>25%</div>
        <div className={s.btn}>50%</div>
        <div className={s.btn}>75%</div>
        <div className={s.btn}>MAX</div>

      </div>
    </div>
  );
};
