import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { Button } from '@components/ui/elements/button';

import { UserPendingRewards } from '../user-pending-rewards';
import styles from './user-reward-info.module.scss';

export const UserRewardInfo: FC = ({ children }) => {
  return (
    <Card className={styles.container} isV2>
      <UserPendingRewards amount="10000.123" />
      <div className={styles.userInfoContainer}>
        <div className={styles.childrenContainer}>{children}</div>
        <Button className={styles.button}>Harvers All</Button>
      </div>
    </Card>
  );
};
