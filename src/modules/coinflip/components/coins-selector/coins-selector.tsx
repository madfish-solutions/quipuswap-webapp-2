import { FC, useState } from 'react';

import { Card } from '@shared/components';
import { QuipuToken } from '@shared/svg';
import { XtzToken } from '@shared/svg/xtz-token';

import { ButtonsSelector } from '../buttons-selector';
import styles from './coins-selector.module.scss';

const INITIAL_ACTIVE_ID = 'xtz';

export const CoinsSelector: FC = () => {
  const [activeId, setActiveId] = useState<string | number>(INITIAL_ACTIVE_ID);

  const handleActiveIdChange = (activeButtonId: number | string): void => {
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
      <ButtonsSelector
        buttons={[
          {
            id: 'xtz',
            label: 'xtz',
            Icon: XtzToken
          },
          {
            id: 'quipu',
            label: 'quipu',
            Icon: QuipuToken
          }
        ]}
        activeId={activeId}
        onChange={handleActiveIdChange}
      />
    </Card>
  );
};
