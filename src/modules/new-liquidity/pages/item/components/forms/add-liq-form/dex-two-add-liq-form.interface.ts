export enum Input {
  FIRST_ADD_LIQ_INPUT = 'add-liq-input-0',
  SECOND_ADD_LIQ_INPUT = 'add-liq-input-1',
  BAKER_INPUT = 'baker-input'
}

export interface NewLiquidityAddFormValues {
  [Input.FIRST_ADD_LIQ_INPUT]: string;
  [Input.SECOND_ADD_LIQ_INPUT]: string;
  [Input.BAKER_INPUT]: string;
}
