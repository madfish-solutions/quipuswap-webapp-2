import { FC, ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import styles from './card.module.scss';

interface Props {
  className?: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    className?: string;
  };
  additional?: ReactNode;
  footer?: ReactNode;
  isV2?: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CardStake: FC<Props> = ({ className, header, additional, footer, children, isV2 = false }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (isV2) {
    return <div className={cx(styles.root, modeClass[colorThemeMode], className)}>{children}</div>;
  }

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      {header && (
        <div className={cx(styles.header, header.className)}>
          {header.content}
          {header.button}
        </div>
      )}
      {additional && <div className={styles.additional}>{additional}</div>}
      {children}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
