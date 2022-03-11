import { FC } from 'react';

import { SmileGreen } from '@components/svg/SmileGreen';
import { SmileRed } from '@components/svg/SmileRed';
import { SmileYellow } from '@components/svg/SmileYellow';

export enum SmileCondition {
  positive = 'positive',
  neutral = 'neutral',
  negative = 'negative'
}

interface SmileProps {
  condition: SmileCondition | undefined;
}

export const Smiles: FC<SmileProps> = ({ condition }) => {
  switch (condition) {
    case SmileCondition.positive:
      return <SmileGreen />;
    case SmileCondition.neutral:
      return <SmileYellow />;
    case SmileCondition.negative:
      return <SmileRed />;
    default:
      return null;
  }
};
