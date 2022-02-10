import { FC } from 'react';

import { Skeleton } from '@components/common/Skeleton';

import styles from './stake-list-skeleton.module.scss';

export const StakeListSkeleton: FC = () => {
  return (
    <div>
      <Skeleton className={styles.listSkeleton} />
    </div>
  );
};
