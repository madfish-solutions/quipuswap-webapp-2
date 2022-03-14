import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Slider } from '@components/ui/slider';
import { TopStats } from '@components/ui/top-stats';

import styles from './list-stats.module.scss';
import { useListStatsViewModel } from './use-list-stats.vm';

export const ListStats: FC = observer(() => {
  const { stats } = useListStatsViewModel();

  return (
    <div className={styles.listStats}>
      <Slider>
        {stats.map(({ title, amount, tooltip, testId }) => (
          <TopStats title={title} amount={amount} key={title} tooltip={tooltip} testId={testId} />
        ))}
      </Slider>
    </div>
  );
});
