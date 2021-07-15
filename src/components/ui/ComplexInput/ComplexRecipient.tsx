import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { Button } from '../Button';

import s from './ComplexInput.module.sass';

type ComplexRecipientProps = {
  className?: string,
  label?:string,
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexRecipient: React.FC<ComplexRecipientProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);
  const [value, onChange] = React.useState<string>('');

  const compoundClassName = cx(
    { [s.focused]: focused },
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
          <div className={s.item2} />

          <input
            className={cx(s.item3, s.input)}
            {...props}
            value={value}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          />
          <Button onMouseDown={(e:React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); e.stopPropagation(); }} theme="quaternary" className={cx(s.item4)}>
            <div className={cx(s.paste)}>
              {t('swap:Paste')}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
