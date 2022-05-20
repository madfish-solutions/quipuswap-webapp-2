export const swap = {
  'The impact your transaction is expected to make on the exchange rate.':
    'The impact your transaction is expected to make on the exchange rate.',
  'Expected fee for this transaction charged by the Tezos blockchain.':
    'Expected fee for this transaction charged by the Tezos blockchain.',
  "When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.":
    "When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.",
  'Swap page': 'Swap page',
  'Swap page description. Couple sentences...': 'Swap page description. Couple sentences...',
  Swap: 'Swap',
  Send: 'Send',
  'Update Rates': 'Update Rates',
  noRouteFoundError:
    "The exchange route can't be built for the provided token. Maybe one of the tokens you exchange isn't listed or there is no path shorter than {{maxHopsCount}} hops.",
  valueOutOfRangeError:
    'Value has to be a number between {{min}} and {{max}}. Note: you need at least 0.1 TEZ to be left on your wallet to swap',
  priceImpactWarning:
    'Note! Your price impact is {{priceImpact}}%. Double check the output amount and/or try to split the exchange to the smaller trades.'
} as const;
