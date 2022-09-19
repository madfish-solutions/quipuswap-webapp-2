import { FC } from 'react';

import { isEmptyArray, isNull } from '@shared/helpers';
import { CaseIcon, DollarIcon, MedalIcon } from '@shared/svg';

import { Categories } from '../../interfaces';
import styles from './new-liquidity-labels.module.scss';

const Component: Record<Categories, FC> = {
  [Categories.Stable]: MedalIcon,
  [Categories.BTC]: CaseIcon,
  [Categories.QuipuSwap]: DollarIcon,
  [Categories.Bridge]: DollarIcon,
  [Categories.Tezotopia]: DollarIcon
};

interface Props {
  categories: Array<Categories>;
}

export const NewLiquidityLabels: FC<Props> = ({ categories }) => {
  if (!isEmptyArray(categories)) {
    // eslint-disable-next-line no-console
    console.log('NewLiquidityLabels', categories);
  }
  const icons = categories.map(category => Component[category]);

  return (
    <div className={styles.root}>
      {icons.map((Label, index) => (
        <div key={`icon-${index}`}>{!isNull(Label) ? <Label /> : null}</div>
      ))}
    </div>
  );
};
