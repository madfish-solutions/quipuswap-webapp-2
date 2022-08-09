import { FC } from 'react';

import { isNull } from '@shared/helpers';
import { CaseIcon, DollarIcon, MedalIcon } from '@shared/svg';
import { Undefined } from '@shared/types';

import { Icon, NewLiquidityLabelsInterface } from '../../interfaces';
import styles from './new-liquidity-labels.module.scss';

const Component: Record<Icon, FC> = {
  [Icon.MEDAL]: MedalIcon,
  [Icon.CASE]: CaseIcon,
  [Icon.DOLLAR]: DollarIcon
};

interface Props {
  newLiquidityLabelsData?: NewLiquidityLabelsInterface;
}

export const NewLiquidityLabels: FC<Props> = ({ newLiquidityLabelsData }) => {
  const entries = Object.entries<Undefined<boolean>, Icon>(newLiquidityLabelsData ?? {});

  const icons: Array<Nullable<FC>> = entries.map(([key, value]) => {
    return (value && Component[key]) || null;
  });

  return (
    <div className={styles.root}>
      {icons.map((Label, index) => (
        <div key={`icon-${index}`}>{!isNull(Label) ? <Label /> : null}</div>
      ))}
    </div>
  );
};
