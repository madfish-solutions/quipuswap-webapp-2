import React, { useContext } from 'react';
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
  label?:string,
  error?:string,
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexInput: React.FC<ComplexInputProps> = ({
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

  const handle25 = () => onChange!! && onChange((parseFloat(balance) * 0.25).toString());
  const handle50 = () => onChange!! && onChange((parseFloat(balance) * 0.5).toString());
  const handle75 = () => onChange!! && onChange((parseFloat(balance) * 0.75).toString());
  const handleMAX = () => onChange!! && onChange(balance);

  const convertValue = value!! && value.toString() + 1;

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
            {...props}
            value={viewValue}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          />
          <Button onMouseDown={(e:React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); e.stopPropagation(); }} theme="quaternary" className={cx(s.item4)}>
            <Token />
            <h6 className={cx(s.token)}>
              TOKEN
            </h6>
            <Shevron />
          </Button>
        </div>
      </div>
      <div className={s.controls}>
        <Button theme="quaternary" onClick={handle25} className={s.btn}>25%</Button>
        <Button theme="quaternary" onClick={handle50} className={s.btn}>50%</Button>
        <Button theme="quaternary" onClick={handle75} className={s.btn}>75%</Button>
        <Button theme="quaternary" onClick={handleMAX} className={s.btn}>MAX</Button>

      </div>
      <div className={s.errorContainer}>
        <p className={cx(s.errorLabel)}>
          {error}
        </p>
      </div>
    </div>
  );
};
