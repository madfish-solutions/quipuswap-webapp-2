export const getAddLiquidityMessage = (firstTokenName: string, secondTokenName: string) => {
  return `The liquidity was invested to the ${firstTokenName}/${secondTokenName} pool!`;
};

export const getInitializeLiquidityMessage = (firstTokenName: string, secondTokenName: string) => {
  return `The the new ${firstTokenName}/${secondTokenName} pool was launched!`;
};

export const getRemoveLiquidityMessage = (firstTokenName: string, secondTokenName: string) => {
  return `The liquidity was removed from the ${firstTokenName}/${secondTokenName} pool!`;
};

export const getSwapMessage = (firstTokenName: string, secondTokenName: string) => {
  return `Swap ${firstTokenName} to ${secondTokenName} was completed!`;
};
