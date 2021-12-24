import { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  addLiquidityTez,
  addPairT2T,
  calculateTokenAmount,
  initializeLiquidityTez
} from '@containers/Liquidity/LiquidityForms/helpers';
import { addLiquidityT2T } from '@containers/Liquidity/LiquidityForms/helpers/add-liquidity-t2t';
import { useLoadTokenBalance } from '@containers/Liquidity/LiquidityForms/hooks';
import { usePairInfo } from '@containers/Liquidity/LiquidityForms/hooks/use-pair-info';
import { validateUserInput } from '@containers/Liquidity/LiquidityForms/validators';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { TEN, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX, ZERO } from '@utils/defaults';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

export const useAddLiqudityService = (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  onTokenAChange: (token: WhitelistedToken) => void,
  onTokenBChange: (token: WhitelistedToken) => void
) => {
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const accountPkh = useAccountPkh();
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);

  const [tokenAInput, setTokenAInput] = useState('');
  const [tokenBInput, setTokenBInput] = useState('');
  const [changedToken, setChangedToken] = useState<Nullable<'tokenA' | 'tokenB'>>(null);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (!changedToken) {
      return;
    }

    if (changedToken === 'tokenB') {
      if (tokenAInput === '') {
        setTokenBInput('');

        return;
      }

      if (!pairInfo || pairInfo.tokenAPool.eq(ZERO) || pairInfo.tokenBPool.eq(ZERO) || pairInfo.totalSupply.eq(ZERO)) {
        return;
      }

      const { totalSupply, tokenAPool, tokenBPool, tokenA: pairTokenA } = pairInfo;

      const tokenADecimals = new BigNumber(TEN).pow(tokenA.metadata.decimals);
      const tokenAAmount = new BigNumber(tokenAInput).multipliedBy(tokenADecimals);

      const tokenBAmount =
        tokenA.contractAddress === pairTokenA.contractAddress
          ? calculateTokenAmount(tokenAAmount, totalSupply, tokenAPool, tokenBPool)
          : calculateTokenAmount(tokenAAmount, totalSupply, tokenBPool, tokenAPool);

      setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
    } else {
      if (tokenBInput === '') {
        setTokenAInput('');

        return;
      }

      if (!pairInfo || pairInfo.tokenAPool.eq(ZERO) || pairInfo.tokenBPool.eq(ZERO) || pairInfo.totalSupply.eq(ZERO)) {
        return;
      }

      const { totalSupply, tokenAPool, tokenBPool, tokenB: pairTokenB } = pairInfo;

      const tokenBDecimals = new BigNumber(TEN).pow(tokenB.metadata.decimals);
      const tokenBAmount = new BigNumber(tokenBInput).multipliedBy(tokenBDecimals);

      const tokenAAmount =
        tokenB.contractAddress === pairTokenB.contractAddress
          ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
          : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

      setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo]);

  const handleSetTokenA = (token: WhitelistedToken) => {
    onTokenAChange(token);
    setChangedToken('tokenA');
    setTokenAInput('');
  };
  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
    setChangedToken('tokenB');
    setTokenBInput('');
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');

      return;
    }

    if (!pairInfo || pairInfo.tokenAPool.eq(ZERO) || pairInfo.tokenBPool.eq(ZERO) || pairInfo.totalSupply.eq(ZERO)) {
      return;
    }

    const tokenADecimals = new BigNumber(TEN).pow(tokenA.metadata.decimals);
    const tokenAAmount = new BigNumber(event.target.value).multipliedBy(tokenADecimals);

    const tokenBAmount =
      tokenA.contractAddress === pairInfo.tokenA.contractAddress
        ? calculateTokenAmount(tokenAAmount, pairInfo.totalSupply, pairInfo.tokenAPool, pairInfo.tokenBPool)
        : calculateTokenAmount(tokenAAmount, pairInfo.totalSupply, pairInfo.tokenBPool, pairInfo.tokenAPool);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
  };
  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');

      return;
    }

    if (!pairInfo || pairInfo.tokenAPool.eq(ZERO) || pairInfo.tokenBPool.eq(ZERO) || pairInfo.totalSupply.eq(ZERO)) {
      return;
    }

    const tokenBDecimals = new BigNumber(TEN).pow(tokenB.metadata.decimals);
    const tokenBAmount = new BigNumber(event.target.value).multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === pairInfo.tokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, pairInfo.totalSupply, pairInfo.tokenBPool, pairInfo.tokenAPool)
        : calculateTokenAmount(tokenBAmount, pairInfo.totalSupply, pairInfo.tokenAPool, pairInfo.tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  const handleTokenABalance = (value: string) => {
    const fixedValue = new BigNumber(value);

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));

    if (!pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply } = pairInfo;

    const tokenADecimals = new BigNumber(TEN).pow(tokenA.metadata.decimals);
    const tokenAAmount = fixedValue.multipliedBy(tokenADecimals);

    const tokenBAmount =
      tokenA.contractAddress === pairInfo.tokenA.contractAddress
        ? calculateTokenAmount(tokenAAmount, totalSupply, tokenAPool, tokenBPool)
        : calculateTokenAmount(tokenAAmount, totalSupply, tokenBPool, tokenAPool);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals));
  };
  const handleTokenBBalance = (value: string) => {
    const fixedValue = new BigNumber(value);

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));

    if (!pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply } = pairInfo;

    const tokenBDecimals = new BigNumber(TEN).pow(tokenB.metadata.decimals);
    const tokenBAmount = fixedValue.multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === pairInfo.tokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
        : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply, id, tokenA: pairTokenA, tokenB: pairTokenB } = pairInfo;

    if (dex.contract.address === TOKEN_TO_TOKEN_DEX) {
      const pairInputA = pairTokenA.contractAddress === tokenA.contractAddress ? tokenAInput : tokenBInput;
      const pairInputB = pairTokenB.contractAddress === tokenB.contractAddress ? tokenBInput : tokenAInput;

      if (id && tokenAPool.gt(ZERO) && tokenBPool.gt(ZERO) && totalSupply.gt(ZERO)) {
        await addLiquidityT2T(
          tezos,
          accountPkh,
          dex,
          id,
          pairInputA,
          pairTokenA,
          pairTokenB,
          totalSupply,
          tokenAPool,
          tokenBPool
        );

        return;
      }
      await addPairT2T(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);

      return;
    }

    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;
    const tezTokenInputBN = new BigNumber(tezTokenInput);
    const tezValue = toDecimals(tezTokenInputBN, TEZOS_TOKEN);

    if (tokenAPool.gt(ZERO) && tokenBPool.gt(ZERO) && totalSupply.gt(ZERO)) {
      await addLiquidityTez(tezos, dex, tezValue);

      return;
    }

    const notTezToken = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenB : tokenA;
    const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBInput : tokenAInput;

    const token: Token = {
      contract: notTezToken.contractAddress,
      id: notTezToken.fa2TokenId
    };
    const notTezTokenInputBN = new BigNumber(notTezTokenInput);
    const tokenBValue = toDecimals(notTezTokenInputBN, notTezToken);
    await initializeLiquidityTez(tezos, networkId, token, tokenBValue, tezValue);
  };

  const errorMessageTokenA = validateUserInput(
    new BigNumber(tokenAInput).multipliedBy(new BigNumber(TEN).pow(tokenA.metadata.decimals)),
    tokenABalance
  );
  const errorMessageTokenB = validateUserInput(
    new BigNumber(tokenBInput).multipliedBy(new BigNumber(TEN).pow(tokenB.metadata.decimals)),
    tokenBBalance
  );

  return {
    errorMessageTokenA,
    errorMessageTokenB,
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  };
};
