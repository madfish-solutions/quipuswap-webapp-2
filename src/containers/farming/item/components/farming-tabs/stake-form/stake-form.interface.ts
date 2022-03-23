export enum StakeFormFields {
  inputAmount = 'inputAmount',
  selectedBaker = 'selectedBaker',
  farmingStatus = 'farmingStatus'
}

export interface StakeFormValues {
  [StakeFormFields.inputAmount]: string;
  [StakeFormFields.selectedBaker]: string;
  [StakeFormFields.farmingStatus]: string;
}
