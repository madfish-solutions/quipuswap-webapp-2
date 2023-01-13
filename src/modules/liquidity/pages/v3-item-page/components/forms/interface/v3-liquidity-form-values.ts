export enum V3AddTokenInput {
  firstTokenInput = 'token-input-0',
  secondTokenInput = 'token-input-1'
}

export interface V3AddFormValues {
  [x: string]: string;
}

export enum V3RemoveTokenInput {
  percantageInput = 'percantage-input',
  tokenXOutput = 'token-x-output',
  tokenYOutput = 'token-y-output'
}

export interface V3RemoveFormValues {
  [V3RemoveTokenInput.percantageInput]: string;
  [V3RemoveTokenInput.tokenXOutput]: string;
  [V3RemoveTokenInput.tokenYOutput]: string;
}
