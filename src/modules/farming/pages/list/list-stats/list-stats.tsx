import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Slider, TopStats } from '@shared/components';

import styles from './list-stats.module.scss';
import { useListStatsViewModel } from './use-list-stats.vm';

export const ListStats: FC = observer(() => {
  const { stats } = useListStatsViewModel();

  return (
    <div className={styles.listStats}>
      <Slider>
        {stats.map(({ title, amount, tooltip }) => (
          <TopStats title={title} amount={amount} key={title} tooltip={tooltip} />
        ))}
      </Slider>
    </div>
  );
});
