import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { sortTokensContracts } from '@containers/Liquidity/liquidutyHelpers';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
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

    const ten = new BigNumber(10);

    const shares = new BigNumber(lpTokenInput).multipliedBy(ten.pow(LP_TOKEN_DECIMALS));
    const tokenAOut = new BigNumber(tokenAOutput).multipliedBy(ten.pow(tokenA.metadata.decimals));
    const tokenBOut = new BigNumber(tokenBOutput).multipliedBy(ten.pow(tokenB.metadata.decimals));

    const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
    const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

    const addresses = sortTokensContracts(tokenA, tokenB);

    if (!addresses) {
      return;
    }
    if (addresses.addressA === tokenA.contractAddress) {
      await dex.contract.methods.divest(pairId, tokenAOut, tokenBOut, shares, timestamp.toString()).send();
    } else {
      await dex.contract.methods.divest(pairId, tokenBOut, tokenAOut, shares, timestamp.toString()).send();
    }
  };

  return {
    handleSubmitRemoveLiquidity
  };
};
