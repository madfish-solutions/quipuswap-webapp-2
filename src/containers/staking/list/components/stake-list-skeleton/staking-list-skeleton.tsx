import { FC } from 'react';

import { Skeleton } from '@components/common/Skeleton';

import styles from './staking-list-skeleton.module.scss';

interface Props {
  className?: string;
}

export const StakingListSkeleton: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Skeleton className={styles.listSkeleton} />
    </div>
  );
};
