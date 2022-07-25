import { FC } from 'react';

import { CaseIcon, DollarIcon, MedalIcon } from '@shared/svg';

import { Icon, NewLiquidityLablesInterface } from '../interfaces';
import styles from './new-liquidity-lables.module.scss';

// TODO: Remove any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Component: any = {
  [Icon.MEDAL]: MedalIcon,
  [Icon.CASE]: CaseIcon,
  [Icon.DOLLAR]: DollarIcon
};

interface Props {
  newLiquidityLablesData?: NewLiquidityLablesInterface;
}

export const NewLiquidityLables: FC<Props> = ({ newLiquidityLablesData }) => {
  const entries = Object.entries(newLiquidityLablesData ?? {});

  const icons: Array<FC> = entries.map(([key, value]) => {
    return value && Component[key];
  });

  return (
    <div className={styles.root}>
      {icons.map((Lable, index) => (
        <div key={`icon-${index}`}>{<Lable />}</div>
      ))}
    </div>
  );
};
