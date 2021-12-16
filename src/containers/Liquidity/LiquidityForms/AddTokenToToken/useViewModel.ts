import { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  sortTokensContracts,
  getValidMichelTemplate,
  calculateTokenAmount,
  allowContractSpendYourTokens,
  addPairTokenToToken
} from '@containers/Liquidity/liquidutyHelpers';
import { useTezos, useAccountPkh } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const useViewModel = (
  dex: Nullable<FoundDex>,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  setTokenA: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>,
  setTokenB: Dispatch<SetStateAction<Nullable<WhitelistedToken>>>
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');
  const [pairId, setPairId] = useState<Nullable<BigNumber>>(null);
  const [pairData, setPairData] = useState<{
    totalSupply: BigNumber;
    tokenAPool: BigNumber;
    tokenBPool: BigNumber;
  } | null>(null);
  const [tokenPairAndInputs, setTokenPairAndInputs] = useState<{
    pairTokenA: WhitelistedToken;
    pairTokenB: WhitelistedToken;
    pairInputA: string;
    pairInputB: string;
  } | null>(null);
  const [changedToken, setChangedToken] = useState<'first' | 'second'>('second');

  useEffect(() => {
    const addresses = sortTokensContracts(tokenA, tokenB);
    if (!addresses) {
      return;
    }
    if (addresses.addressA === tokenA.contractAddress) {
      setTokenPairAndInputs({
        pairTokenA: tokenA,
        pairTokenB: tokenB,
        pairInputA: tokenAInput,
        pairInputB: tokenBInput
      });
    } else {
      setTokenPairAndInputs({
        pairTokenA: tokenB,
        pairTokenB: tokenA,
        pairInputA: tokenBInput,
        pairInputB: tokenAInput
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAInput, tokenBInput]);

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

      const id = await dex.storage.storage.token_to_id.get(key);

      if (id) {
        const data = await dex.storage.storage.pairs.get(id);
        if (isMounted && data) {
          setPairId(id);
          setPairData({
            totalSupply: data.total_supply,
            tokenAPool: data.token_a_pool,
            tokenBPool: data.token_b_pool
          });
        }
      } else if (!id && isMounted) {
        setPairData(null);
        setPairId(null);
      }
    };
    loadPairData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dex]);

  useEffect(() => {
    if (
      !pairData ||
      !tokenPairAndInputs ||
      pairData.tokenAPool.eq(0) ||
      pairData.tokenBPool.eq(0) ||
      pairData.totalSupply.eq(0)
    ) {
      if (changedToken === 'first') {
        setTokenAInput('0');
      } else {
        setTokenBInput('0');
      }

      return;
    }

    if (changedToken === 'first') {
      if (tokenBInput === '') {
        setTokenAInput('');

        return;
      }

      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBAmountWithDecimals = new BigNumber(tokenBInput).multipliedBy(decimalsB);
      const calculatedTokenAInput =
        tokenB.contractAddress === tokenPairAndInputs.pairTokenB.contractAddress
          ? calculateTokenAmount(
              tokenBAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenBPool,
              pairData.tokenAPool
            )
          : calculateTokenAmount(
              tokenBAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenAPool,
              pairData.tokenBPool
            );

      setTokenAInput(fromDecimals(calculatedTokenAInput, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    } else {
      if (tokenAInput === '') {
        setTokenBInput('');

        return;
      }

      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = new BigNumber(tokenAInput).multipliedBy(decimalsA);
      const calculatedTokenAInput =
        tokenA.contractAddress === tokenPairAndInputs.pairTokenA.contractAddress
          ? calculateTokenAmount(
              tokenAAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenAPool,
              pairData.tokenBPool
            )
          : calculateTokenAmount(
              tokenAAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenBPool,
              pairData.tokenAPool
            );

      setTokenBInput(fromDecimals(calculatedTokenAInput, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairData]);

  useEffect(() => {
    setChangedToken('first');
  }, [tokenA]);
  useEffect(() => {
    setChangedToken('second');
  }, [tokenB]);

  const handleTokenAInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');

      return;
    }

    if (
      pairData &&
      tokenPairAndInputs &&
      pairData.tokenAPool.gt(0) &&
      pairData.tokenBPool.gt(0) &&
      pairData.totalSupply.gt(0)
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = new BigNumber(event.target.value).multipliedBy(decimalsA);
      const tokenBAmount =
        tokenA.contractAddress === tokenPairAndInputs.pairTokenA.contractAddress
          ? calculateTokenAmount(
              tokenAAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenAPool,
              pairData.tokenBPool
            )
          : calculateTokenAmount(
              tokenAAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenBPool,
              pairData.tokenAPool
            );

      setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    }
  };
  const handleTokenBInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');

      return;
    }

    if (
      pairData &&
      tokenPairAndInputs &&
      pairData.tokenAPool.gt(0) &&
      pairData.tokenBPool.gt(0) &&
      pairData.totalSupply.gt(0)
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenAAmount =
        tokenB.contractAddress === tokenPairAndInputs.pairTokenB.contractAddress
          ? calculateTokenAmount(
              new BigNumber(event.target.value).multipliedBy(decimalsB),
              pairData.totalSupply,
              pairData.tokenBPool,
              pairData.tokenAPool
            )
          : calculateTokenAmount(
              new BigNumber(event.target.value).multipliedBy(decimalsB),
              pairData.totalSupply,
              pairData.tokenAPool,
              pairData.tokenBPool
            );

      setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    }
  };

  const handleTokenABalance = (value: string) => {
    const tokenAAmount = new BigNumber(value);

    setTokenAInput(tokenAAmount.toFixed(tokenA.metadata.decimals));

    if (
      pairData &&
      tokenPairAndInputs &&
      pairData.tokenAPool.gt(0) &&
      pairData.tokenBPool.gt(0) &&
      pairData.totalSupply.gt(0)
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = tokenAAmount.multipliedBy(decimalsA);
      const tokenBAmount =
        tokenB.contractAddress === tokenPairAndInputs.pairTokenB.contractAddress
          ? calculateTokenAmount(
              tokenAAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenAPool,
              pairData.tokenBPool
            )
          : calculateTokenAmount(
              tokenAAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenBPool,
              pairData.tokenAPool
            );

      setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    }
  };
  const handleTokenBBalance = (value: string) => {
    const tokenBAmount = new BigNumber(value);

    setTokenBInput(tokenBAmount.toFixed(tokenB.metadata.decimals));

    if (
      pairData &&
      tokenPairAndInputs &&
      pairData.tokenAPool.gt(0) &&
      pairData.tokenBPool.gt(0) &&
      pairData.totalSupply.gt(0)
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBAmountWithDecimals = tokenBAmount.multipliedBy(decimalsB);
      const tokenAAmount =
        tokenA.contractAddress === tokenPairAndInputs.pairTokenA.contractAddress
          ? calculateTokenAmount(
              tokenBAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenBPool,
              pairData.tokenAPool
            )
          : calculateTokenAmount(
              tokenBAmountWithDecimals,
              pairData.totalSupply,
              pairData.tokenAPool,
              pairData.tokenBPool
            );

      setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    }
  };

  const handleSetTokenA = (token: WhitelistedToken) => {
    setTokenA(token);
    setTokenAInput('Loading...');
  };
  const handleSetTokenB = (token: WhitelistedToken) => {
    setTokenB(token);
    setTokenBInput('Loading...');
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !dex || !tokenPairAndInputs) {
      return;
    }
    const ten = new BigNumber(10);
    const { pairTokenA, pairTokenB, pairInputA, pairInputB } = tokenPairAndInputs;

    if (pairId && pairData && pairData.tokenAPool.gt(0) && pairData.tokenBPool.gt(0) && pairData.totalSupply.gt(0)) {
      const tokenAAmount = new BigNumber(pairInputA).multipliedBy(ten.pow(pairTokenA.metadata.decimals));
      const shares = tokenAAmount.multipliedBy(pairData.totalSupply).idiv(pairData.tokenAPool);
      const tokenBAmount = shares
        .multipliedBy(pairData.tokenBPool)
        .div(pairData.totalSupply)
        .integerValue(BigNumber.ROUND_CEIL);

      const tokenAUpdateOperator = allowContractSpendYourTokens(
        tezos,
        pairTokenA,
        dex.contract.address,
        tokenAAmount,
        accountPkh
      );
      const tokenBUpdateOperator = allowContractSpendYourTokens(
        tezos,
        pairTokenB,
        dex.contract.address,
        tokenBAmount,
        accountPkh
      );

      const tokensUpdateOperators = await Promise.all([tokenAUpdateOperator, tokenBUpdateOperator]);
      if (!tokensUpdateOperators[0] || !tokensUpdateOperators[1]) {
        return;
      }

      const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
      const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

      const investParams = dex.contract.methods.invest(
        pairId,
        shares,
        tokenAAmount,
        tokenBAmount,
        timestamp.toString()
      );

      const batch = tezos.wallet
        .batch()
        .withContractCall(tokensUpdateOperators[0])
        .withContractCall(tokensUpdateOperators[1])
        .withContractCall(investParams);

      await batch.send();
    } else {
      addPairTokenToToken(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);
    }
  };

  return {
    accountPkh,
    tokenAInput,
    tokenBInput,
    handleTokenAInput,
    handleTokenBInput,
    handleTokenABalance,
    handleTokenBBalance,
    handleSetTokenA,
    handleSetTokenB,
    handleAddLiquidity
  };
};
