import { FC } from 'react';

import { Skeleton } from '@components/common/Skeleton';

import styles from './farming-list-skeleton.module.scss';

interface Props {
  className?: string;
}

export const FarmingListSkeleton: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Skeleton className={styles.listSkeleton} />
    </div>
  );
};
