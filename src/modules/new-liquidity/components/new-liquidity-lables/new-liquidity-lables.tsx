import { FC } from 'react';

import { isNull } from '@shared/helpers';
import { CaseIcon, DollarIcon, MedalIcon } from '@shared/svg';
import { Undefined } from '@shared/types';

import { Icon, NewLiquidityLablesInterface } from '../../interfaces';
import styles from './new-liquidity-lables.module.scss';

const Component: Record<Icon, FC> = {
  [Icon.MEDAL]: MedalIcon,
  [Icon.CASE]: CaseIcon,
  [Icon.DOLLAR]: DollarIcon
};

interface Props {
  newLiquidityLablesData?: NewLiquidityLablesInterface;
}

export const NewLiquidityLables: FC<Props> = ({ newLiquidityLablesData }) => {
  const entries = Object.entries<Undefined<boolean>, Icon>(newLiquidityLablesData ?? {});

  const icons: Array<Nullable<FC>> = entries.map(([key, value]) => {
    return (value && Component[key]) || null;
  });

  return (
    <div className={styles.root}>
      {icons.map((Lable, index) => (
        <div key={`icon-${index}`}>{!isNull(Lable) ? <Lable /> : null}</div>
      ))}
    </div>
  );
};
