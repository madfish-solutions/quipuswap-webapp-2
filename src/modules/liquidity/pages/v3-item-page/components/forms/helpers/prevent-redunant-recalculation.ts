import { PERCENT_100 } from '@config/constants';

export const preventRedundantRecalculation = (inputAmount: string) =>
  Number(inputAmount) > PERCENT_100 ? String(PERCENT_100) : inputAmount;
