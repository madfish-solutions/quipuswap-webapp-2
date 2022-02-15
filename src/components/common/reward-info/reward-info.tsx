import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { Button } from '@components/ui/elements/button';

import { PendingRewards } from '../pending-rewards';
import styles from './reward-info.module.scss';

interface Props {
  pendingRewardAmount: string;
  handleHarvestAll: () => void;
}

const HARVEST_ALL = 'Harvest All';

export const RewardInfo: FC<Props> = ({ pendingRewardAmount, handleHarvestAll, children }) => {
  return (
    <Card className={styles.container} isV2>
      <PendingRewards pendingRewardAmount={pendingRewardAmount} />
      <div className={styles.userInfoContainer}>
        <div className={styles.childrenContainer}>{children}</div>
        <Button className={styles.button} onClick={handleHarvestAll}>
          {HARVEST_ALL}
        </Button>
      </div>
    </Card>
  );
};
