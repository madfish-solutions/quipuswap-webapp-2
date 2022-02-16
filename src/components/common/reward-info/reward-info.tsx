import { FC, ReactNode } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { Card } from '@components/ui/card';
import { Button } from '@components/ui/elements/button';

import { PendingRewards } from '../pending-rewards';
import styles from './reward-info.module.scss';

interface Props {
  amount: BigNumber;
  currency: string;
  onHarvestAll: () => void;
  header?: ReactNode;
}

export const RewardInfo: FC<Props> = ({ amount, onHarvestAll, currency, header, children }) => {
  const { t } = useTranslation(['stake']);

  return (
    <Card className={styles.card} header={header ? { content: header } : undefined}>
      <div className={styles.container}>
        <PendingRewards amount={amount} currency={currency} />
        <div className={styles.userInfoContainer}>
          <div className={styles.childrenContainer}>{children}</div>
          <Button className={styles.button} onClick={onHarvestAll}>
            {t('stake|Harvest All')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
