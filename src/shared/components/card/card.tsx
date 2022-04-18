import { FC, ReactNode, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StatusLabel } from '@shared/components/status-label';
import { ActiveStatus } from '@shared/types';
import { DataTestAttribute } from '@tests/types';

import styles from './card.module.scss';

interface Props extends DataTestAttribute {
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
  contentClassName,
  testId
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (isV2) {
    return <div className={cx(styles.root, modeClass[colorThemeMode], className)}>{children}</div>;
  }

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)} data-test-id={testId}>
      {header && (
        <div className={cx(styles.header, header.className)}>
          {header.content}
          {header.status ? <StatusLabel filled status={header.status} /> : null}
          {header.button}
        </div>
      )}
      {additional && <div className={styles.additional}>{additional}</div>}
      <div className={cx(styles.content, contentClassName)}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
