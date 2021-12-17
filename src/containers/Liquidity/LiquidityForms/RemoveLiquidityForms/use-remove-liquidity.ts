import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { sortTokensContracts } from '@containers/Liquidity/liquidutyHelpers';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
import { toDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

export const useRemoveLiquidity = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const handleSubmitRemoveLiquidity = async ({
    lpTokenInput,
    tokenA,
    tokenB,
    tokenAOutput,
    tokenBOutput,
    pairId,
    dex
  }: {
    lpTokenInput: string;
    tokenA: WhitelistedToken;
    tokenB: WhitelistedToken;
    tokenAOutput: string;
    tokenBOutput: string;
    pairId: never;
    dex: FoundDex | null;
  }) => {
    if (!tezos || !accountPkh || !dex) {
      throw new Error('Some of the Tools are undefined');
    }

    const shares = toDecimals(new BigNumber(lpTokenInput), LP_TOKEN_DECIMALS);
    const tokenAOut = toDecimals(new BigNumber(tokenAOutput), tokenA.metadata.decimals);
    const tokenBOut = toDecimals(new BigNumber(tokenBOutput), tokenB.metadata.decimals);

    const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
    const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

    const addresses = sortTokensContracts(tokenA, tokenB);

    if (!addresses) {
      return;
    }
    const token1 = addresses.addressA === tokenA.contractAddress ? tokenAOut : tokenBOut;
    const token2 = addresses.addressA === tokenA.contractAddress ? tokenBOut : tokenAOut;
    await dex.contract.methods.divest(pairId, token1, token2, shares, timestamp.toString()).send();
  };

  return {
    handleSubmitRemoveLiquidity
  };
};
