import React, { useContext, useState, useCallback } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Tooltip } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { parseDecimals } from '@utils/helpers';
import { validateMinMax } from '@utils/validators';
import { Input } from '@components/ui/Input';

import s from './Slippage.module.sass';

const slippagePercents = ['0.5 %', '1 %', '3 %'];

type StickyBlockProps = {
  className?: string,
  handleChange: (value:string) => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const Percentage: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx(className, s.customPercent)}>%</div>
);

export const Slippage: React.FC<StickyBlockProps> = ({
  className,
  handleChange,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [activeButton, setActiveButton] = useState<number | 'input' | null>(0);
  const [customValue, setCustomValue] = useState<string>('');

  const handleCustomValueChange = useCallback((val) => {
    const valWrapper = parseDecimals(val, 0, 30, 3);
    const validValue = validateMinMax(0, 30)(valWrapper);
    if (!validValue) {
      setCustomValue(valWrapper);
      handleChange(valWrapper);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <span className={s.header}>
        Slippage
        <Tooltip content={t('common|Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through.')} />
      </span>
      <div className={s.buttons}>
        {slippagePercents.map((percent, index) => (
          <button
            key={percent}
            type="button"
            className={cx(s.button, { [s.active]: index === activeButton })}
            onClick={() => {
              setActiveButton(index);
              handleCustomValueChange('');
              handleChange(percent);
            }}
          >
            <span className={s.buttonInner}>
              {percent}
            </span>
          </button>
        ))}
        <Input
          inputSize="small"
          placeholder="CUSTOM"
          value={customValue}
          EndAdornment={customValue ? Percentage : undefined}
          active={activeButton === 'input'}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setActiveButton('input');
            handleCustomValueChange(val);
          }}
        />
      </div>
    </div>
  );
};
