import { FC } from 'react';

import styles from './loader-fallback.module.scss';
import { Loader } from '../loader';

export const LoaderFallback: FC = () => {
  return (
    <div className={styles.loaderFallback}>
      <Loader />
    </div>
  );
};
