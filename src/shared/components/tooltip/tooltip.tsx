import { FC, ReactNode, useContext } from 'react';

import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Info } from '@shared/svg';

import s from './tooltip.module.sass';

export interface TooltipProps extends TippyProps {
  content: ReactNode;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Tooltip: FC<TooltipProps> = ({ content, className, ...props }) => {
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
