import { FC } from 'react';

import { cloneArray } from '@shared/helpers';
import { CaseIcon, DollarIcon, MedalIcon } from '@shared/svg';

import { NewLiquidityLablesInterface } from '../interfaces';
import styles from './new-liquidity-lables.module.scss';

const lables = [MedalIcon, CaseIcon, DollarIcon];

interface Props {
  newLiquidityLablesData?: NewLiquidityLablesInterface;
}

export const NewLiquidityLables: FC<Props> = ({ newLiquidityLablesData }) => {
  const clonedArray = cloneArray(lables);

  if (newLiquidityLablesData) {
    if (!newLiquidityLablesData.caseIcon) {
      clonedArray.splice(1, 1);
    }

    if (!newLiquidityLablesData.medalIcon) {
      clonedArray.shift();
    }

    if (!newLiquidityLablesData.dollarIcon) {
      clonedArray.pop();
    }
  }

  return (
    <div className={styles.root}>
      {clonedArray.map(Lable => (
        <div>{<Lable />}</div>
      ))}
    </div>
  );
};
