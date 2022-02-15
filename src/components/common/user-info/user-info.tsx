import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { Button } from '@components/ui/elements/button';

import { UserRewards } from '../user-rewards';
import styles from './user-info.module.scss';

export const UserInfo: FC = ({ children }) => {
  return (
    <Card className={styles.container} isV2>
      <UserRewards amount="10000.123" />
      <div className={styles.userInfoContainer}>
        <div className={styles.childrenContainer}>{children}</div>
        <Button className={styles.button}>Harvers All</Button>
      </div>
    </Card>
  );
};
