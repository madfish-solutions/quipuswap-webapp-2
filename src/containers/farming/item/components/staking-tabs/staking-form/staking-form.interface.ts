export enum StakingFormFields {
  inputAmount = 'inputAmount',
  selectedBaker = 'selectedBaker',
  stakingStatus = 'stakingStatus'
}

export interface StakingFormValues {
  [StakingFormFields.inputAmount]: string;
  [StakingFormFields.selectedBaker]: string;
  [StakingFormFields.stakingStatus]: string;
}
