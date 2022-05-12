import { FC, useState } from 'react';

import { Card } from '@shared/components';
import { QuipuToken } from '@shared/svg';
import { XtzToken } from '@shared/svg/xtz-token';

import { ButtonsSelector } from '../buttons-selector';
import styles from './coins-selector.module.scss';

const INITIAL_ACTIVE_ID = 0;

export const CoinsSelector: FC = () => {
  const [activeId, setActiveId] = useState<number>(INITIAL_ACTIVE_ID);

  const handleActiveIdChange = (activeButtonId: number): void => {
    setActiveId(activeButtonId);
  };

  return (
    <Card
      header={{
        content: 'Select Token to Play with'
      }}
      contentClassName={styles.cardContent}
      className={styles.card}
    >
      <div className={styles.root}>
        <ButtonsSelector
          buttons={[
            {
              id: 0,
              label: 'xtz',
              Icon: XtzToken
            },
            {
              id: 1,
              label: 'quipu',
              Icon: QuipuToken
            }
          ]}
          activeId={activeId}
          onChangeId={handleActiveIdChange}
        />
      </div>
    </Card>
  );
};
