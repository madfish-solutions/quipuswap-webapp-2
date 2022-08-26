import { Standard } from '@shared/types';

export const LP_TOKEN = {
  type: 'FA2' as Standard,
  contractAddress: 'KT1A4tdqDYbh6S4ugegh5WYPJmYzxWXAtFco',
  fa2TokenId: 3,
  isWhitelisted: true,
  metadata: {
    name: 'Quipuswap LP Token',
    symbol: 'QPT',
    decimals: 6,
    description: 'Quipuswap LP token represents user share in the liquidity pool',
    thumbnailUri: 'https://quipuswap.com/QPLP.png',
    shouldPreferSymbol: 'true'
  }
};
