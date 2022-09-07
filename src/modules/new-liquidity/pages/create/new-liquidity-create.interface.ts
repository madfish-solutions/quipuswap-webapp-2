export enum NewLiqCreateInput {
  FIRST_INPUT = 'new-liq-create-input-0',
  SECOND_INPUT = 'new-liq-create-input-1',
  BAKER_INPUT = 'baker-input'
}

export interface NewLiqCreateFormValues {
  [NewLiqCreateInput.FIRST_INPUT]: string;
  [NewLiqCreateInput.SECOND_INPUT]: string;
  [NewLiqCreateInput.BAKER_INPUT]: string;
}
