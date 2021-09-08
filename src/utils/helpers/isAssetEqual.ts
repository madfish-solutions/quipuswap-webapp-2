import { Token } from '@quipuswap/sdk';

export const isAssetEqual = (
  a : Token,
  b : Token,
) => a.contract === b.contract
&& a.id === b.id;
