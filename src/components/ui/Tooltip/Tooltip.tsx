import React, { useContext } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import Info from '@icons/Info.svg';

import s from './Tooltip.module.sass';

type TooltipProps = {
  content: React.ReactNode,
  sizeT?: keyof typeof sizeClass
  className?: string
} & TippyProps;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const sizeClass = {
  default: s.default,
  small: s.small,
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  sizeT = 'default',
  className,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
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
      <div className={cx(s.wrapper, sizeClass[sizeT], className)}>
        <Info className={s.info} />
      </div>
    </Tippy>
  );
};
