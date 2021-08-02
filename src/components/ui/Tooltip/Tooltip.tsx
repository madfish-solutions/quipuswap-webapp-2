import React, { useContext } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

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
  content, className, children, ...props
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
      {/* <div className={cx(modeClass[colorThemeMode], s.tippyContent)}> */}
      <div className={cx(s.wrapper, className)}>
        {children}
      </div>
    </Tippy>
  );
};
