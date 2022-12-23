import { FC } from 'react';

import { isNull } from '@shared/helpers';
import {
  StableCategory,
  BtcCategory,
  QuipuCategory,
  BridgeCategory,
  TezotopiaCategory,
  V3Category
} from '@shared/svg/categories';

import { Categories } from '../../interfaces';
import styles from './liquidity-labels.module.scss';

const Component: Record<Categories, FC> = {
  [Categories.Stable]: StableCategory,
  [Categories.BTC]: BtcCategory,
  [Categories.QuipuSwap]: QuipuCategory,
  [Categories.Bridge]: BridgeCategory,
  [Categories.Tezotopia]: TezotopiaCategory,
  [Categories.V3]: V3Category
};

interface Props {
  categories: Array<Categories>;
  colored?: boolean;
}

export const LiquidityLabels: FC<Props> = ({ categories, colored }) => {
  const icons = categories.map(category => Component[category]);

  return (
    <div className={styles.root}>
      {icons.map((Label: FC<Pick<Props, 'colored'>>, index) => (
        <div key={`icon-${index}`}>{!isNull(Label) ? <Label colored={colored} /> : null}</div>
      ))}
    </div>
  );
};
