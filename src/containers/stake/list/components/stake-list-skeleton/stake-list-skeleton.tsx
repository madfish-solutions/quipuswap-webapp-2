import { FC } from 'react';

import { Skeleton } from '@components/common/Skeleton';

import styles from './stake-list-skeleton.module.scss';

interface Props {
  className?: string;
}

export const StakeListSkeleton: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Skeleton className={styles.listSkeleton} />
    </div>
  );
};
