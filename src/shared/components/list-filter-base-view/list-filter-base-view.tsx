import { FC, ReactNode } from 'react';

import cx from 'classnames';

import { Card } from '../card';
import { Iterator } from '../iterator';
import { SorterProps, SorterView } from '../sorter-view';
import { SwitcherLabel, SwitcherLabelProps } from '../switcher-list-filter-view';
import styles from './list-filter-base-view.module.scss';

export enum SorterPositionEnum {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface ListFilterBaseViewProps {
  switcherDataList: Array<SwitcherLabelProps>;
  sorterProps: SorterProps;
  leftSide?: ReactNode;
  rightSide?: ReactNode;
  contentClassName?: string;
  sorterClassName?: string;
  sorterPosition?: SorterPositionEnum;
}

export const ListFilterBaseView: FC<ListFilterBaseViewProps> = ({
  sorterProps,
  switcherDataList,
  leftSide,
  rightSide,
  contentClassName,
  sorterClassName,
  sorterPosition = SorterPositionEnum.RIGHT
}) => {
  return (
    <Card
      contentClassName={cx(styles.cardContent, contentClassName)}
      className={styles.filterCard}
      data-test-id="ListFilterInputView"
    >
      {sorterPosition === SorterPositionEnum.LEFT && (
        <div className={cx(sorterClassName, styles.switcherContainer, styles.sorterContainer)}>
          <SorterView {...sorterProps} />
        </div>
      )}

      {leftSide}

      <Iterator render={SwitcherLabel} data={switcherDataList} />

      {rightSide}

      {sorterPosition === SorterPositionEnum.RIGHT && (
        <div className={cx(sorterClassName, styles.switcherContainer, styles.sorterContainer)}>
          <SorterView {...sorterProps} />
        </div>
      )}
    </Card>
  );
};
