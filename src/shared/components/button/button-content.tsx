import { FC } from 'react';

import cx from 'classnames';

import { LogoSmallMonochrome } from '@shared/svg';

import { ButtonProps } from './button';
import styles from './button.module.scss';

type ButtonContentProps = Pick<ButtonProps, 'theme' | 'innerClassName' | 'textClassName' | 'loading'>;

export const ButtonContent: FC<ButtonContentProps> = ({ children, theme, innerClassName, textClassName, loading }) => {
  if (loading) {
    return theme === 'secondary' ? (
      <span className={cx(styles.inner, innerClassName)}>
        <LogoSmallMonochrome className={styles.loadingIcon} />
      </span>
    ) : (
      <LogoSmallMonochrome className={styles.loadingIcon} />
    );
  }

  switch (theme) {
    case 'primary':
      return <>{children}</>;
    case 'secondary':
      return (
        <span className={cx(styles.inner, innerClassName)}>
          <span className={cx(styles.text, textClassName)}>{children}</span>
        </span>
      );
    default:
      return <span className={cx(styles.text, textClassName)}>{children}</span>;
  }
};
