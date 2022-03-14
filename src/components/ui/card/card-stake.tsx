import { FC, ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StakeStatusBox } from '@containers/staking/list/components';
import { StakingStatus } from '@interfaces/staking.interfaces';

import s from './card.module.scss';

export interface CardProps {
  className?: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    className?: string;
  };
  additional?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  stakeStatus: StakingStatus;
  isV2?: boolean;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const CardStake: FC<CardProps> = ({
  className,
  header,
  additional,
  contentClassName,
  footer,
  children,
  stakeStatus,
  isV2 = false
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (isV2) {
    return <div className={cx(s.root, modeClass[colorThemeMode], className)}>{children}</div>;
  }

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {header && (
        <div className={cx(s.header, header.className)}>
          <div className={s.label}>{header.content}</div>
          <StakeStatusBox status={stakeStatus} />
          {header.button}
        </div>
      )}
      {additional && <div className={s.additional}>{additional}</div>}
      <div className={cx(s.content, contentClassName)}>{children}</div>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
};
