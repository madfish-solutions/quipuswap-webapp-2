import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { Slider, TopStats } from '@shared/components';
import { Optional } from '@shared/types';

import styles from './list-stats.module.scss';

interface Stats {
  title: string;
  amount: Optional<BigNumber>;
  tooltip: string;
  currency?: Nullable<string>;
}
interface Props {
  slidesToShow?: number;
  stats: Array<Stats>;
}

const DEFAULT_SLIDES_TO_SHOW = 4;

export const ListStats: FC<Props> = ({ stats, slidesToShow = DEFAULT_SLIDES_TO_SHOW }) => {
  return (
    <div className={styles.listStats} data-test-id="farmingListStats">
      <Slider slidesToShow={slidesToShow}>
        {stats.map(({ title, amount, tooltip, currency }) => (
          <TopStats title={title} amount={amount} currency={currency} key={title} tooltip={tooltip} />
        ))}
      </Slider>
    </div>
  );
};
