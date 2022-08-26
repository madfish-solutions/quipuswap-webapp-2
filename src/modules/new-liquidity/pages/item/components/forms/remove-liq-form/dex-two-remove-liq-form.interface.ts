export enum Input {
  FIRST_ADD_LIQ_INPUT = 'remove-liq-input-0',
  SECOND_ADD_LIQ_INPUT = 'remove-liq-input-1',
  LP_INPUT = 'remove-liq-input-2'
}

export interface NewLiquidityRemoveFormValues {
  [Input.FIRST_ADD_LIQ_INPUT]: string;
  [Input.SECOND_ADD_LIQ_INPUT]: string;
  [Input.LP_INPUT]: string;
}
