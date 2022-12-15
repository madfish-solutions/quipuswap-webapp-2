export enum CreatePositionInput {
  MIN_PRICE = 'create-position-price-input-0',
  MAX_PRICE = 'create-position-price-input-1',
  FULL_RANGE_POSITION = 'full-range-position',
  FIRST_AMOUNT_INPUT = 'create-position-input-0',
  SECOND_AMOUNT_INPUT = 'create-position-input-1'
}

export type CreatePositionAmountInput =
  | CreatePositionInput.FIRST_AMOUNT_INPUT
  | CreatePositionInput.SECOND_AMOUNT_INPUT;
export type CreatePositionPriceInput = CreatePositionInput.MIN_PRICE | CreatePositionInput.MAX_PRICE;

export interface CreatePositionFormValues {
  [CreatePositionInput.MIN_PRICE]: string;
  [CreatePositionInput.MAX_PRICE]: string;
  [CreatePositionInput.FULL_RANGE_POSITION]: boolean;
  [CreatePositionInput.FIRST_AMOUNT_INPUT]: string;
  [CreatePositionInput.SECOND_AMOUNT_INPUT]: string;
}
