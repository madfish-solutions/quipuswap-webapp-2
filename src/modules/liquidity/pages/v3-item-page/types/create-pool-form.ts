import { Token } from '@shared/types';

export enum eCreatePoolValues {
  feeRate = 'feeRate',
  initialPrice = 'initialPrice',
  tokens = 'tokens',
  activeAssetIndex = 'activeAssetIndex'
}

export interface CreatePoolValues {
  [eCreatePoolValues.feeRate]: number;
  [eCreatePoolValues.initialPrice]: string;
  [eCreatePoolValues.tokens]: Array<Token>;
  [eCreatePoolValues.activeAssetIndex]: number;
}
