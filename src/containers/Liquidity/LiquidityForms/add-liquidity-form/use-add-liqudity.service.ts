import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { EMPTY_POOL_AMOUNT, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, Undefined, WhitelistedToken } from '@utils/types';

import {
  addLiquidityTez,
  addLiquidityTokenToToken,
  addPairTokenToToken,
  calculateTokenAmount,
  initializeLiquidityTez,
  sortTokensContracts
} from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { validations } from '../validators';
import { LastChangedToken } from './last-changed-token.enum';
import { PairInfo } from './pair-info.interface';

export const useAddLiquidityService = (
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
  const [validationMessageTokenA, setValidationMessageTokenA] = useState<Undefined<string>>();
  const [validationMessageTokenB, setValidationMessageTokenB] = useState<Undefined<string>>();
  const [lastEditedInput, setLastEditedInput] = useState<Nullable<LastChangedToken>>(null);

  const tokensCalculations = (
    tokenAInput: string,
    tokenA: WhitelistedToken,
    tokenB: WhitelistedToken,
    pairInfo: Nullable<PairInfo>,
    tokenABalance: Nullable<BigNumber>,
    tokenBBalance: Nullable<BigNumber>,
    setTokenAInput: Dispatch<SetStateAction<string>>,
    setTokenBInput: Dispatch<SetStateAction<string>>,
    setValidationMessageTokenA: Dispatch<SetStateAction<Undefined<string>>>,
    setValidationMessageTokenB: Dispatch<SetStateAction<Undefined<string>>>
  ) => {
    setTokenAInput(tokenAInput);

    if (tokenAInput === '') {
      setTokenBInput('');
      setValidationMessageTokenA(undefined);
      setValidationMessageTokenB(undefined);

      return;
    }

    if (
      !pairInfo ||
      pairInfo.tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      pairInfo.totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return;
    }

    const { tokenAPool, tokenBPool, totalSupply, tokenA: pairTokenA } = pairInfo;

    const tokenABN = new BigNumber(tokenAInput);
    const tokenAAmount = toDecimals(tokenABN, tokenA);

    const validationA = validations(accountPkh, tokenAAmount, tokenABalance);
    setValidationMessageTokenA(validationA);

    if (validationA === 'Invalid input') {
      setTokenBInput('');

      return;
    }

    const isTokensOrderValid = tokenA.contractAddress === pairTokenA.contractAddress;
    const validTokenAPool = isTokensOrderValid ? tokenAPool : tokenBPool;
    const validTokenBPool = isTokensOrderValid ? tokenBPool : tokenAPool;

    const tokenBAmount = calculateTokenAmount(tokenAAmount, totalSupply, validTokenAPool, validTokenBPool);

    const validationB = validations(accountPkh, tokenBAmount, tokenBBalance);
    setValidationMessageTokenB(validationB);

    setTokenBInput(fromDecimals(tokenBAmount, tokenB).toFixed());
  };

  useEffect(() => {
    if (!lastEditedInput) {
      return;
    }

    if (lastEditedInput === LastChangedToken.tokenA) {
      tokensCalculations(
        tokenAInput,
        tokenA,
        tokenB,
        pairInfo,
        tokenABalance,
        tokenBBalance,
        setTokenAInput,
        setTokenBInput,
        setValidationMessageTokenA,
        setValidationMessageTokenB
      );
    } else {
      tokensCalculations(
        tokenBInput,
        tokenB,
        tokenA,
        pairInfo,
        tokenABalance,
        tokenBBalance,
        setTokenBInput,
        setTokenAInput,
        setValidationMessageTokenB,
        setValidationMessageTokenA
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo, tokenABalance, tokenBBalance]);

  const handleSetTokenA = (token: WhitelistedToken) => {
    onTokenAChange(token);
    if (lastEditedInput === LastChangedToken.tokenA) {
      setTokenBInput('');
    } else {
      setTokenAInput('');
    }
  };

  const handleSetTokenB = (token: WhitelistedToken) => {
    onTokenBChange(token);
    if (lastEditedInput === LastChangedToken.tokenB) {
      setTokenAInput('');
    } else {
      setTokenBInput('');
    }
  };

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastEditedInput(LastChangedToken.tokenA);
    tokensCalculations(
      event.target.value,
      tokenA,
      tokenB,
      pairInfo,
      tokenABalance,
      tokenBBalance,
      setTokenAInput,
      setTokenBInput,
      setValidationMessageTokenA,
      setValidationMessageTokenB
    );
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      event.target.value,
      tokenB,
      tokenA,
      pairInfo,
      tokenBBalance,
      tokenABalance,
      setTokenBInput,
      setTokenAInput,
      setValidationMessageTokenB,
      setValidationMessageTokenA
    );
  };

  const handleTokenABalance = (value: string) => {
    setLastEditedInput(LastChangedToken.tokenA);
    tokensCalculations(
      value,
      tokenA,
      tokenB,
      pairInfo,
      tokenABalance,
      tokenBBalance,
      setTokenAInput,
      setTokenBInput,
      setValidationMessageTokenA,
      setValidationMessageTokenB
    );
  };

  const handleTokenBBalance = (value: string) => {
    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      value,
      tokenB,
      tokenA,
      pairInfo,
      tokenBBalance,
      tokenABalance,
      setTokenBInput,
      setTokenAInput,
      setValidationMessageTokenB,
      setValidationMessageTokenA
    );
  };

  const investTokenToToken = async () => {
    if (!tezos || !accountPkh) {
      return;
    }

    const { addressA, addressB } = sortTokensContracts(tokenA, tokenB);
    const pairTokenA = addressA === tokenA.contractAddress ? tokenA : tokenB;
    const pairTokenB = addressB === tokenB.contractAddress ? tokenB : tokenA;
    const pairInputA = addressA === tokenA.contractAddress ? tokenAInput : tokenBInput;
    const pairInputB = addressB === tokenB.contractAddress ? tokenBInput : tokenAInput;

    if (!pairInfo) {
      return await addPairTokenToToken(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);
    }

    const { id, tokenAPool, tokenBPool, totalSupply } = pairInfo;

    if (
      !id ||
      tokenAPool.eq(EMPTY_POOL_AMOUNT) ||
      tokenBPool.eq(EMPTY_POOL_AMOUNT) ||
      totalSupply.eq(EMPTY_POOL_AMOUNT)
    ) {
      return await addPairTokenToToken(tezos, dex, accountPkh, pairTokenA, pairTokenB, pairInputA, pairInputB);
    }

    return await addLiquidityTokenToToken(
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
  };

  const investTezosToToken = async () => {
    if (!tezos || !accountPkh) {
      return;
    }

    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;
    const tezTokenBN = new BigNumber(tezTokenInput);
    const tezValue = toDecimals(tezTokenBN, TEZOS_TOKEN);

    const shouldAddLiquidity =
      pairInfo && pairInfo.tokenAPool.gt(EMPTY_POOL_AMOUNT) && pairInfo.tokenBPool.gt(EMPTY_POOL_AMOUNT);

    if (shouldAddLiquidity) {
      await addLiquidityTez(tezos, dex, tezValue);

      return;
    }

    const notTezToken = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenB : tokenA;
    const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBInput : tokenAInput;

    const token: Token = {
      contract: notTezToken.contractAddress,
      id: notTezToken.fa2TokenId
    };
    const notTezTokenBN = new BigNumber(notTezTokenInput);
    const tokenBValue = toDecimals(notTezTokenBN, notTezToken);
    await initializeLiquidityTez(tezos, networkId, token, tokenBValue, tezValue);
  };

  const handleAddLiquidity = async () => {
    if (dex.contract.address === TOKEN_TO_TOKEN_DEX) {
      return await investTokenToToken();
    }

    return await investTezosToToken();
  };

  return {
    validationMessageTokenA,
    validationMessageTokenB,
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
