import { FC } from 'react';

import { Card } from '@shared/components';
import { QuipuToken } from '@shared/svg';
import { XtzToken } from '@shared/svg/xtz-token';

import styles from './coins-selector.module.scss';

export const CoinsSelector: FC = () => (
  <Card
    header={{
      content: 'Select Token to Play with'
    }}
    contentClassName={styles.cardContent}
    className={styles.card}
  >
    <div className={styles.root}>
      <button className={styles.buttonWrapper}>
        <XtzToken id="coinSelector" className={styles.token} />
        <p className={styles.label}>xtz</p>
      </button>
      <button className={styles.buttonWrapper}>
        <QuipuToken id="coinSelector" className={styles.token} />
        <p className={styles.label}>quipu</p>
      </button>
    </div>
  </Card>
);
