import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { Shevron } from '@components/svg/Shevron';
import Token from '@icons/Token.svg';

import s from './ComplexInput.module.sass';
import { Button } from '../Button';

type ComplexInputProps = {
  className?: string,
  balance?: string,
  label?:string
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexInput: React.FC<ComplexInputProps> = ({
  className,
  balance = '10.00',
  label,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [value, setValue] = useState('');

  const viewValue = value;

  const handle25 = () => setValue((parseFloat(balance) * 0.25).toString());
  const handle50 = () => setValue((parseFloat(balance) * 0.5).toString());
  const handle75 = () => setValue((parseFloat(balance) * 0.75).toString());
  const handleMAX = () => setValue(balance);

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
            {t('common:Total Balance')}
            :
          </div>
          <div className={cx(s.label2, s.price)}>
            {prettyPrice(parseFloat(balance))}
          </div>
        </div>

        <input
          className={cx(s.item3, s.input)}
          value={viewValue}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          {...props}
        />
        <div className={cx(s.item4)}>
          <Token />
          <h6 className={cx(s.token)}>
            TOKEN
          </h6>
          <Shevron />
        </div>
      </div>
      <div className={s.controls}>
        <Button theme="quaternary" onClick={handle25} className={s.btn}>25%</Button>
        <Button theme="quaternary" onClick={handle50} className={s.btn}>50%</Button>
        <Button theme="quaternary" onClick={handle75} className={s.btn}>75%</Button>
        <Button theme="quaternary" onClick={handleMAX} className={s.btn}>MAX</Button>

      </div>
    </div>
  );
};
