import { FC, ReactNode } from 'react';

import cx from 'classnames';

import { Card } from '../card';
import { Iterator } from '../iterator';
import { SorterProps, SorterView } from '../sorter-view';
import { SwitcherLabel, SwitcherLabelProps } from '../switcher-list-filter-view';
import styles from './list-filter-base-view.module.scss';

export interface ListFilterBaseViewProps {
  switcherDataList: Array<SwitcherLabelProps>;
  sorterProps: SorterProps;
  leftSide?: ReactNode;
  rightSide?: ReactNode;
}

export const ListFilterBaseView: FC<ListFilterBaseViewProps> = ({
  sorterProps,
  switcherDataList,
  leftSide,
  rightSide
}) => {
  return (
    <Card contentClassName={styles.cardContent} className={styles.filterCard} data-test-id="ListFilterInputView">
      {leftSide}

      <Iterator render={SwitcherLabel} data={switcherDataList} />

      {rightSide}

      <div className={cx(styles.switcherContainer, styles.sorterContainer)}>
        <SorterView {...sorterProps} />
      </div>
    </Card>
  );
};
