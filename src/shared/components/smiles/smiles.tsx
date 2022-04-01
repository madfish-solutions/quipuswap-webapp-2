import { FC } from 'react';

import { SmileGreen, SmileYellow, SmileRed } from '@shared/svg';
import { Nullable } from '@shared/types';

export enum SmileCondition {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}

interface SmileProps {
  condition: Nullable<SmileCondition>;
}

export const Smiles: FC<SmileProps> = ({ condition }) => {
  switch (condition) {
    case SmileCondition.POSITIVE:
      return <SmileGreen />;
    case SmileCondition.NEUTRAL:
      return <SmileYellow />;
    case SmileCondition.NEGATIVE:
      return <SmileRed />;
    default:
      return null;
  }
};
