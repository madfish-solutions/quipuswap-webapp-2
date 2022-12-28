export enum V3AddTokenInput {
  firstTokenInput = 'tokenInput-0',
  secondTokenInput = 'tokenInput-1'
}

export interface V3AddFormValues {
  [V3AddTokenInput.firstTokenInput]: string;
  [V3AddTokenInput.secondTokenInput]: string;
}

export enum V3RemoveTokenInput {
  lpTokenInput = 'lpTokenInput',
  tokenXInput = 'tokenXInput',
  tokenYInput = 'tokenYInput'
}

export interface V3RemoveFormValues {
  [V3RemoveTokenInput.lpTokenInput]: string;
  [V3RemoveTokenInput.tokenXInput]: string;
  [V3RemoveTokenInput.tokenYInput]: string;
}
