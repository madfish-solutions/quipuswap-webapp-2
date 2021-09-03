import { FoundDex } from '@quipuswap/sdk';

export const isDexEqual = (
  a : FoundDex,
  b : FoundDex,
) => a.contract === b.contract;
