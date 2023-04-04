import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { AssetSwitcher } from '@shared/components';

import styles from './pool-type-filter.module.scss';
import { usePoolTypeFilterViewModel } from './pool-type-filter.vm';

interface Props {
  className?: string;
}

export const PoolTypeFilter: FC<Props> = observer(({ className }) => {
  const { activePoolTypeIndex, handlePoolTypeButtonClick, labels } = usePoolTypeFilterViewModel();

  return (
    <AssetSwitcher
      className={cx(styles.root, className)}
      labels={labels}
      activeIndex={activePoolTypeIndex}
      handleButtonClick={handlePoolTypeButtonClick}
    />
  );
});
