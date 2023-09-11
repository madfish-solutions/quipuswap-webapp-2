import { FC, ReactNode } from 'react';

import cx from 'classnames';

import styles from './list-filter-base-view.module.scss';
import { Card } from '../card';
import { Iterator } from '../iterator';
import { SorterProps, SorterView } from '../sorter-view';
import { SwitcherLabel, SwitcherLabelProps } from '../switcher-list-filter-view';

export interface ListFilterBaseViewProps {
  switcherDataList: Array<SwitcherLabelProps>;
  sorterProps: SorterProps;
  leftSide?: ReactNode;
  rightSide?: ReactNode;
  contentClassName?: string;
  sorterClassName?: string;
}

export const ListFilterBaseView: FC<ListFilterBaseViewProps> = ({
  sorterProps,
  switcherDataList,
  leftSide,
  rightSide,
  contentClassName,
  sorterClassName
}) => {
  return (
    <Card
      contentClassName={cx(styles.cardContent, contentClassName)}
      className={styles.filterCard}
      data-test-id="ListFilterInputView"
    >
      {leftSide}

      <Iterator render={SwitcherLabel} data={switcherDataList} />

      {rightSide}

      <div className={cx(sorterClassName, styles.switcherContainer, styles.sorterContainer)}>
        <SorterView {...sorterProps} />
      </div>
    </Card>
  );
};
