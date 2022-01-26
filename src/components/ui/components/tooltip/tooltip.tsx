import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext, Info } from '@quipuswap/ui-kit';
import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import s from './tooltip.module.sass';

export interface TooltipProps extends TippyProps {
  content: React.ReactNode;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Tooltip: React.FC<TooltipProps> = ({ content, className, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(s.root, modeClass[colorThemeMode]);

  return (
    <Tippy className={compoundClassName} duration={0} {...props} content={content}>
      <div className={cx(s.wrapper, s.small, className)}>
        <Info className={cx(s.info, modeClass[colorThemeMode])} />
      </div>
    </Tippy>
  );
};
