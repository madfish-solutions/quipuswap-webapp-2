import { FC, ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StatusLabel } from '@components/ui/status-label';
import { ActiveStatus } from '@interfaces/staking.interfaces';

import styles from './card.module.scss';

interface Props {
  className?: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    status?: ActiveStatus;
    className?: string;
  };
  additional?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
  isV2?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Card: FC<Props> = ({
  className,
  header,
  additional,
  footer,
  children,
  isV2 = false,
  contentClassName
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (isV2) {
    return <div className={cx(styles.root, modeClass[colorThemeMode], className)}>{children}</div>;
  }

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      {header && (
        <div className={cx(styles.header, header.className)}>
          {header.content}
          {header.status ? <StatusLabel status={header.status} /> : null}
          {header.button}
        </div>
      )}
      {additional && <div className={styles.additional}>{additional}</div>}
      <div className={cx(styles.content, contentClassName)}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
