export enum Input {
  FIRST_LIQ_INPUT = 'liq-input-0',
  SECOND_LIQ_INPUT = 'liq-input-1',
  THIRD_INPUT = 'liq-input-2'
}

export interface NewLiquidityFormValues {
  [Input.FIRST_LIQ_INPUT]: string;
  [Input.SECOND_LIQ_INPUT]: string;
  [Input.THIRD_INPUT]: string;
}
