import { FC } from 'react';

import { isNull } from '@shared/helpers';
import { StableCategory, BtcCategory, QuipuCategory, BridgeCategory, TezotopiaCategory } from '@shared/svg/categories';

import { Categories } from '../../interfaces';
import styles from './new-liquidity-labels.module.scss';

const Component: Record<Categories, FC> = {
  [Categories.Stable]: StableCategory,
  [Categories.BTC]: BtcCategory,
  [Categories.QuipuSwap]: QuipuCategory,
  [Categories.Bridge]: BridgeCategory,
  [Categories.Tezotopia]: TezotopiaCategory
};

interface Props {
  categories: Array<Categories>;
}

export const NewLiquidityLabels: FC<Props> = ({ categories }) => {
  const icons = categories.map(category => Component[category]);

  return (
    <div className={styles.root}>
      {icons.map((Label, index) => (
        <div key={`icon-${index}`}>{!isNull(Label) ? <Label /> : null}</div>
      ))}
    </div>
  );
};
