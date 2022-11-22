import { FC } from 'react';

import { Loader } from '../loader';
import styles from './loader-fallback.module.scss';

export const LoaderFallback: FC = () => {
  return (
    <div className={styles.loaderFallback}>
      <Loader />
    </div>
  );
};
