import { BlockResponse, BlockFullHeader } from '@taquito/rpc';

interface BlockInterface extends Pick<BlockResponse, 'protocol' | 'chain_id' | 'hash'> {
  header: Pick<BlockFullHeader, 'level' | 'timestamp'>;
}

export enum RawDexType {
  QuipuSwap = 'QuipuSwap',
  QuipuSwapTokenToTokenDex = 'QuipuSwapTokenToTokenDex',
  Plenty = 'Plenty',
  LiquidityBaking = 'LiquidityBaking'
}

export enum RawDexTokenStandard {
  FA1_2 = 'FA1_2',
  FA2 = 'FA2'
}

export interface RawDexPool {
  dexType: RawDexType;
  dexAddress: string;
  dexId?: string;
  aTokenSlug: string;
  bTokenSlug: string;
  aTokenStandard?: RawDexTokenStandard;
  aTokenPool: string;
  bTokenPool: string;
  bTokenStandard?: RawDexTokenStandard;
}

export interface RawDexPoolsResponse {
  block: BlockInterface;
  routePairs: RawDexPool[];
}
