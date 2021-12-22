import { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  addLiquidityTez,
  addPairT2T,
  allowContractSpendYourTokens,
  calculateTokenAmount,
  initializeLiquidityTez,
  sortTokensContracts
} from '@containers/Liquidity/LiquidityForms/helpers';
import { useLoadTokenBalance } from '@containers/Liquidity/LiquidityForms/hooks';
import { usePairInfo } from '@containers/Liquidity/LiquidityForms/hooks/use-pair-info';
import { validateUserInput } from '@containers/Liquidity/LiquidityForms/validators';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';
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

      if (!pairInfo || pairInfo.tokenAPool.eq(0) || pairInfo.tokenBPool.eq(0) || pairInfo.totalSupply.eq(0)) {
        return;
      }

      const { totalSupply, tokenAPool, tokenBPool, tokenA: pairTokenA } = pairInfo;

      const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
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

      if (!pairInfo || pairInfo.tokenAPool.eq(0) || pairInfo.tokenBPool.eq(0) || pairInfo.totalSupply.eq(0)) {
        return;
      }

      const { totalSupply, tokenAPool, tokenBPool, tokenB: pairTokenB } = pairInfo;

      const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
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
    setTokenAInput('0.0');
  };
  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
    setChangedToken('tokenB');
    setTokenBInput('0.0');
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');

      return;
    }

    if (!pairInfo || pairInfo.tokenAPool.eq(0) || pairInfo.tokenBPool.eq(0) || pairInfo.totalSupply.eq(0)) {
      return;
    }

    const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
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

    if (!pairInfo || pairInfo.tokenAPool.eq(0) || pairInfo.tokenBPool.eq(0) || pairInfo.totalSupply.eq(0)) {
      return;
    }

    const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
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

    const tokenADecimals = new BigNumber(10).pow(tokenA.metadata.decimals);
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

    const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
    const tokenBAmount = fixedValue.multipliedBy(tokenBDecimals);

    const tokenAAmount =
      tokenB.contractAddress === pairInfo.tokenB.contractAddress
        ? calculateTokenAmount(tokenBAmount, totalSupply, tokenBPool, tokenAPool)
        : calculateTokenAmount(tokenBAmount, totalSupply, tokenAPool, tokenBPool);

    setTokenAInput(fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals));
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !pairInfo) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply, id } = pairInfo;

    if (dex.contract.address === TOKEN_TO_TOKEN_DEX) {
      // addLiqTokenToToken
      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) {
        return;
      }
      const pairTokenA = addresses.addressA === tokenA.contractAddress ? tokenA : tokenB;
      const pairInputA = addresses.addressA === tokenA.contractAddress ? tokenAInput : tokenBInput;
      const pairTokenB = addresses.addressB === tokenB.contractAddress ? tokenB : tokenA;
      const pairInputB = addresses.addressB === tokenB.contractAddress ? tokenBInput : tokenAInput;

      const ten = new BigNumber(10);

      if (tokenAPool.gt(0) && tokenBPool.gt(0) && totalSupply.gt(0)) {
        const tokenAAmount = new BigNumber(pairInputA).multipliedBy(ten.pow(pairTokenA.metadata.decimals));
        const shares = tokenAAmount.multipliedBy(totalSupply).idiv(tokenAPool);
        const tokenBAmount = shares.multipliedBy(tokenBPool).div(totalSupply).integerValue(BigNumber.ROUND_CEIL);

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

        const investParams = dex.contract.methods.invest(id, shares, tokenAAmount, tokenBAmount, timestamp.toString());

        const batch = tezos.wallet
          .batch()
          .withContractCall(tokensUpdateOperators[0])
          .withContractCall(tokensUpdateOperators[1])
          .withContractCall(investParams);

        await batch.send();
      } else {
        addPairT2T(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);
      }
    } else {
      const notTezToken = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenB : tokenA;
      const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBInput : tokenAInput;
      const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;

      const tezDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);
      const tezValue = new BigNumber(tezTokenInput).multipliedBy(tezDecimals);

      if (tokenAPool.gt(0) && tokenBPool.gt(0) && totalSupply.gt(0)) {
        await addLiquidityTez(tezos, dex, tezValue);
      } else {
        const token: Token = {
          contract: notTezToken.contractAddress,
          id: notTezToken.fa2TokenId
        };
        const tokenBDecimals = new BigNumber(10).pow(notTezToken.metadata.decimals);
        const tokenBValue = new BigNumber(notTezTokenInput).multipliedBy(tokenBDecimals);
        await initializeLiquidityTez(tezos, networkId, token, tokenBValue, tezValue);
      }
    }
  };

  const errorMessageTokenA = validateUserInput(new BigNumber(tokenAInput), new BigNumber(tokenABalance));
  const errorMessageTokenB = validateUserInput(new BigNumber(tokenBInput), new BigNumber(tokenBBalance));

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
