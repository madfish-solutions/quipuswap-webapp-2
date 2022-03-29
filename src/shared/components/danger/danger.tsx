import { FC, ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import { DangerIcon } from '@shared/svg/danger-icon';

import s from './danger.module.sass';

export interface TooltipProps extends TippyProps {
  content: ReactNode;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Danger: FC<TooltipProps> = ({ content, className, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(s.root, modeClass[colorThemeMode]);

  return (
    <Tippy className={compoundClassName} duration={0} {...props} content={content}>
      <div className={cx(s.wrapper, s.small, className)}>
        <DangerIcon className={cx(s.info, modeClass[colorThemeMode])} />
      </div>
    </Tippy>
  );
};
