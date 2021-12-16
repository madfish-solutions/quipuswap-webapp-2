import { useState, useEffect, ChangeEvent } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { sortTokensContracts, getValidMichelTemplate } from '@containers/Liquidity/liquidutyHelpers';
import { useTezos, useAccountPkh } from '@utils/dapp';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const useViewModel = (dex: Nullable<FoundDex>, tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [pairId, setPairId] = useState();
  const [lpTokenInput, setLpTokenInput] = useState('');
  const [tokenAOutput, setTokenAOutput] = useState('');
  const [tokenBOutput, setTokenBOutput] = useState('');
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber;
    tokenAPool: BigNumber;
    tokenBPool: BigNumber;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPairData = async () => {
      if (!dex) {
        return;
      }

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) {
        return;
      }

      const michelData = getValidMichelTemplate(addresses);
      const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

      const pairIdTemp = await dex.storage.storage.token_to_id.get(key);

      if (pairIdTemp) {
        const pairDataTemp = await dex.storage.storage.pairs.get(pairIdTemp);
        if (isMounted) {
          setPairId(pairIdTemp);
          setPairDataInfo({
            totalSupply: pairDataTemp.total_supply,
            tokenAPool: pairDataTemp.token_a_pool,
            tokenBPool: pairDataTemp.token_b_pool
          });
        }
      } else {
        setPairDataInfo(null);
      }
    };
    loadPairData();

    return () => {
      isMounted = false;
    };
    // Ignore tokenA & tokenB
    // eslint-disable-next-line
  }, [dex]);

  useEffect(() => {
    if (!dex || !pairData) {
      return;
    }
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }
    const addresses = sortTokensContracts(tokenA, tokenB);
    if (!addresses) {
      return;
    }

    const tokenAPerOneLp =
      addresses.addressA === tokenA.contractAddress
        ? pairData.tokenAPool.dividedBy(pairData.totalSupply)
        : pairData.tokenBPool.dividedBy(pairData.totalSupply);
    const tokenBPerOneLp =
      addresses.addressB === tokenB.contractAddress
        ? pairData.tokenBPool.dividedBy(pairData.totalSupply)
        : pairData.tokenAPool.dividedBy(pairData.totalSupply);

    const lpInputWithDecimals = new BigNumber(10).pow(6).multipliedBy(lpTokenInput);

    const tokenAOut = tokenAPerOneLp.multipliedBy(lpInputWithDecimals);
    const tokenBOut = tokenBPerOneLp.multipliedBy(lpInputWithDecimals);

    setTokenAOutput(fromDecimals(tokenAOut, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    setTokenBOutput(fromDecimals(tokenBOut, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    // Ignore tokenA & tokenB
    // eslint-disable-next-line
  }, [lpTokenInput, dex, pairData]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const handleBalance = (value: string) => {
    const fixedValue = new BigNumber(value);
    setLpTokenInput(fixedValue.toFixed());
  };

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) {
      return;
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

    setLpTokenInput('');
  };

  return { accountPkh, lpTokenInput, tokenAOutput, tokenBOutput, handleRemoveLiquidity, handleChange, handleBalance };
};
