import React, { useContext, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Input } from '@components/ui/Input';

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
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [activeButton, setActiveButton] = useState<number | null>(0);
  const [inputValue, setInputValue] = useState(slippagePercents[0]);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <span className={s.header}>Slippage</span>
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
