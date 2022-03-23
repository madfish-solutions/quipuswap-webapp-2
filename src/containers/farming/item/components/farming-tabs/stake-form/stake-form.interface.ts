export enum StakeFormFields {
  inputAmount = 'inputAmount',
  selectedBaker = 'selectedBaker',
  farmStatus = 'farmStatus'
}

export interface StakeFormValues {
  [StakeFormFields.inputAmount]: string;
  [StakeFormFields.selectedBaker]: string;
  [StakeFormFields.farmStatus]: string;
}
