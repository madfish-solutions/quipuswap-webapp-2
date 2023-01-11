export enum V3AddTokenInput {
  firstTokenInput = 'tokenInput-0',
  secondTokenInput = 'tokenInput-1'
}

export interface V3AddFormValues {
  [x: string]: string;
}

export enum V3RemoveTokenInput {
  percantageInput = 'percantageInput',
  tokenXOutput = 'tokenXOutput',
  tokenYOutput = 'tokenYOutput'
}

export interface V3RemoveFormValues {
  [V3RemoveTokenInput.percantageInput]: string;
  [V3RemoveTokenInput.tokenXOutput]: string;
  [V3RemoveTokenInput.tokenYOutput]: string;
}
