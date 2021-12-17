import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { sortTokensContracts } from '@containers/Liquidity/liquidutyHelpers';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';

const BASE_TEN = 10;

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

    const tenBN = new BigNumber(BASE_TEN);

    const shares = new BigNumber(lpTokenInput).multipliedBy(tenBN.pow(LP_TOKEN_DECIMALS));
    const tokenAOut = new BigNumber(tokenAOutput).multipliedBy(tenBN.pow(tokenA.metadata.decimals));
    const tokenBOut = new BigNumber(tokenBOutput).multipliedBy(tenBN.pow(tokenB.metadata.decimals));

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
