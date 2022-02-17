import { PoolTableType } from '@interfaces/types';
type Pair = Pick<PoolTableType, 'pair'>;

export const getHref = ({ pair }: Pair) => {
  const tokenA = pair.token1.id === 'Tez' ? 'tez' : `${pair.token1.id}_${pair.token1.tokenId}`;
  const tokenB = pair.token2.id === 'Tez' ? 'tez' : `${pair.token2.id}_${pair.token2.tokenId}`;

  return `/swap/${tokenA}-${tokenB}`;
};
