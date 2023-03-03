import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Slider, TopStats } from '@shared/components';
import { Nullable, Optional } from '@shared/types';

import styles from './list-stats.module.scss';

interface Stats {
  title: string;
  amount: Optional<BigNumber>;
  tooltip: string;
  currency?: Nullable<string>;
  isError?: boolean;
  children?: ReactNode;
}
interface Props {
  slidesToShow?: number;
  stats: Array<Stats>;
}

const DEFAULT_SLIDES_TO_SHOW = 4;

export const ListStats: FC<Props> = ({ stats, slidesToShow = DEFAULT_SLIDES_TO_SHOW }) => {
  const sliderClassName = cx({ [styles.cardPadding]: stats.length > slidesToShow });

  return (
    <div className={styles.listStats} data-test-id="farmingListStats">
      <Slider className={sliderClassName} slidesToShow={slidesToShow}>
        {stats.map(({ title, amount, tooltip, currency, isError, children }) => (
          <TopStats title={title} amount={amount} currency={currency} key={title} tooltip={tooltip} isError={isError}>
            {children}
          </TopStats>
        ))}
      </Slider>
    </div>
  );
};
