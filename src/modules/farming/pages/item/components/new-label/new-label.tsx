import { FC } from 'react';

import cx from 'classnames';

import { useLayoutViewModel } from '@layout';

import styles from './new-label.module.scss';

export const NewLabel: FC = () => {
  const { isDarkTheme } = useLayoutViewModel();

  return (
    <div className={styles.wrapper}>
      <div className={cx(styles.root, isDarkTheme ? styles.dark : styles.light)}>
        <span className={styles.text}>NEW</span>
      </div>
    </div>
  );
};
