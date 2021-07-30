import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Input } from '@components/ui/Input';

import { Tooltip } from '@components/ui/Tooltip';
import s from './Slippage.module.sass';

const slippagePercents = ['0.5 %', '1 %', '3 %'];

type StickyBlockProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Slippage: React.FC<StickyBlockProps> = ({
  className,
}) => {
  const { t } = useTranslation(['swap']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [activeButton, setActiveButton] = useState<number | null>(0);
  const [inputValue, setInputValue] = useState(slippagePercents[0]);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <span className={s.header}>
        <Tooltip content={t('swap:Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through.')}>
          Slippage

        </Tooltip>
      </span>
      <div className={s.buttons}>
        {slippagePercents.map((percent, index) => (
          <button
            key={percent}
            type="button"
            className={cx(s.button, { [s.active]: index === activeButton })}
            onClick={() => {
              setActiveButton(index);
              setInputValue(percent);
            }}
          >
            <span className={s.buttonInner}>
              {percent}
            </span>
          </button>
        ))}
        <Input
          inputSize="small"
          value={inputValue}
          onChange={(e) => {
            setActiveButton(null);
            setInputValue(e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
};
