export const settings = {
  settings: 'Settings',
  liquiditySlippage: 'Liquidity Slippage',
  slippageTooltip:
    'Slippage is the difference between the expected price of an order and the price when the order actually executes. If in the process of conducting a swap, someone removed/added liquidity to the pool it might change expected token price.',
  tradingSlippage: 'Trading Slippage',
  tradingTooltip:
    'Slippage is the difference between the expected price of an order and the price when the order actually executes. The slippage percentage shows how much the price for a specific asset has moved in the process of trading operation. If you conduct a swap that might drastically change the token number in a pool, you need to increase the liquidity slippage percent.',
  reset: 'Reset',
  save: 'Save'
} as const;
