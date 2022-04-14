import { BigNumber } from 'bignumber.js';

import { SwapTabAction, Token } from '@shared/types';

export enum SwapField {
  INPUT_AMOUNT = 'inputAmount',
  OUTPUT_AMOUNT = 'outputAmount',
  INPUT_TOKEN = 'inputToken',
  OUTPUT_TOKEN = 'outputToken',
  RECIPIENT = 'recipient',
  ACTION = 'action'
}

export type SwapAmountFieldName = SwapField.INPUT_AMOUNT | SwapField.OUTPUT_AMOUNT;

export type SwapTokensFieldName = SwapField.INPUT_TOKEN | SwapField.OUTPUT_TOKEN;

export interface SwapFormValues {
  [SwapField.INPUT_TOKEN]: Token;
  [SwapField.OUTPUT_TOKEN]: Token;
  [SwapField.INPUT_AMOUNT]: BigNumber;
  [SwapField.OUTPUT_AMOUNT]: BigNumber;
  [SwapField.RECIPIENT]: string;
  [SwapField.ACTION]: SwapTabAction;
}
