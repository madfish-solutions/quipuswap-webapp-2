export enum V3AddTokenInput {
  firstTokenInput = 'tokenInput-0',
  secondTokenInput = 'tokenInput-1'
}

export interface V3AddFormValues {
  [V3AddTokenInput.firstTokenInput]: string;
  [V3AddTokenInput.secondTokenInput]: string;
}

export enum V3RemoveTokenInput {
  firstTokenInput = 'tokenInput-0',
  secondTokenInput = 'tokenInput-1',
  thirdTokenInput = 'tokenInput-2'
}

export interface V3RemoveFormValues {
  [V3RemoveTokenInput.firstTokenInput]: string;
  [V3RemoveTokenInput.secondTokenInput]: string;
  [V3RemoveTokenInput.thirdTokenInput]: string;
}
