import { FC, ReactNode, useContext } from 'react';

import Tippy, { TippyProps } from '@tippyjs/react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Info } from '@shared/svg';

import styles from './tooltip.module.sass';

export interface TooltipProps extends TippyProps {
  content: ReactNode;
  testId?: string;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Tooltip: FC<TooltipProps> = ({ content, className, testId, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.root, modeClass[colorThemeMode]);

  return (
    <Tippy className={compoundClassName} duration={0} {...props} content={content}>
      <div data-cy={testId} className={cx(styles.wrapper, styles.small, className)}>
        <Info className={cx(styles.info, modeClass[colorThemeMode])} />
      </div>
    </Tippy>
  );
};
