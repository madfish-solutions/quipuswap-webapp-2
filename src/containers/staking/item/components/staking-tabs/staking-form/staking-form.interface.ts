export enum StakingFormFields {
  inputAmount = 'inputAmount',
  selectedBaker = 'selectedBaker'
}

export interface StakingFormValues {
  [StakingFormFields.inputAmount]: string;
  [StakingFormFields.selectedBaker]: string;
}
