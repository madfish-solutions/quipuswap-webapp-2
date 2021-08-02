import React, { useContext } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import Info from '@icons/Info.svg';

import s from './Tooltip.module.sass';

type TooltipProps = {
  content: React.ReactNode,
  className?: string
} & TippyProps;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Tooltip: React.FC<TooltipProps> = ({
  content, className, ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    // s.tippy,
    s.root,
    modeClass[colorThemeMode],
  );

  return (
    <Tippy
      className={compoundClassName}
      duration={0}
      {...props}
      content={content}
    >
      <div className={cx(s.wrapper, className)}>
        <Info className={s.info} />
      </div>
    </Tippy>
  );
};
