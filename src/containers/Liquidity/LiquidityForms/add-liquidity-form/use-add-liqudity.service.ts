import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { EMPTY_POOL_AMOUNT, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, Undefined, WhitelistedToken } from '@utils/types';

import { addLiquidityTez, addLiquidityTokenToToken, addPairTokenToToken, initializeLiquidityTez } from '../blockchain';
import { getAddLiquidityMessage, getInitializeLiquidityMessage } from '../get-success-messages';
import { calculateTokenAmount, sortTokensContracts } from '../helpers';
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
  const confirmOperation = useConfirmOperation();

  const [tokenAInput, setTokenAInput] = useState('');
  const [tokenBInput, setTokenBInput] = useState('');
  const [validationMessageTokenA, setValidationMessageTokenA] = useState<Undefined<string>>();
  const [validationMessageTokenB, setValidationMessageTokenB] = useState<Undefined<string>>();
  const [lastEditedInput, setLastEditedInput] = useState<Nullable<LastChangedToken>>(null);

  const tokensCalculations = (
    tokenXInput: string,
    pairInfo: Nullable<PairInfo>,
    [tokenX, tokenY]: [WhitelistedToken, WhitelistedToken],
    [tokenXBalance, tokenYBalance]: [Nullable<BigNumber>,Nullable<BigNumber>],
    [setTokenXInput, setTokenYInput]: [Dispatch<SetStateAction<string>>,Dispatch<SetStateAction<string>>],
    [setValidationMessageTokenX, setValidationMessageTokenY]: [Dispatch<SetStateAction<Undefined<string>>> ,Dispatch<SetStateAction<Undefined<string>>> ]
  ) => {
    setTokenXInput(tokenXInput);
  
    if (tokenXInput === '') {
      setTokenYInput('');
      setValidationMessageTokenX(undefined);
      setValidationMessageTokenY(undefined);
  
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
  
    const { 
      totalSupply,
      tokenAPool: tokenXPool, 
      tokenBPool: tokenYPool, 
      tokenA: pairTokenX 
    } = pairInfo;
  
    const tokenXBN = new BigNumber(tokenXInput);
    const tokenXAmount = toDecimals(tokenXBN, tokenX);
  
    const validationX = validations(accountPkh, tokenXAmount, tokenXBalance);
    setValidationMessageTokenX(validationX);
  
    if (validationX === 'Invalid input') {
      setTokenYInput('');
  
      return;
    }
  
    const isTokensOrderValid = tokenX.contractAddress === pairTokenX.contractAddress;
    const validTokenXPool = isTokensOrderValid ? tokenXPool : tokenYPool;
    const validTokenYPool = isTokensOrderValid ? tokenYPool : tokenXPool;
  
    const tokenYAmount = calculateTokenAmount(tokenXAmount, totalSupply, validTokenXPool, validTokenYPool);
  
    const validationY = validations(accountPkh, tokenYAmount, tokenYBalance);
    setValidationMessageTokenY(validationY);
  
    setTokenYInput(fromDecimals(tokenYAmount, tokenY).toFixed());
  };

  useEffect(() => {
    if (!lastEditedInput) {
      return;
    }

    if (lastEditedInput === LastChangedToken.tokenA) {
      tokensCalculations(
        tokenAInput,
        pairInfo,
        [tokenA, tokenB],
        [tokenABalance, tokenBBalance],
        [setTokenAInput, setTokenBInput],
        [setValidationMessageTokenA, setValidationMessageTokenB],
      );
    } else {
      tokensCalculations(
        tokenBInput,
        pairInfo,
        [tokenB, tokenA],
        [tokenBBalance, tokenABalance],
        [setTokenBInput, setTokenAInput],
        [setValidationMessageTokenB, setValidationMessageTokenA],
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
      pairInfo,
      [tokenA, tokenB],
      [tokenABalance, tokenBBalance],
      [setTokenAInput, setTokenBInput],
      [setValidationMessageTokenA, setValidationMessageTokenB],
    );
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      event.target.value,
      pairInfo,
      [tokenB, tokenA],
      [tokenBBalance, tokenABalance],
      [setTokenBInput, setTokenAInput],
      [setValidationMessageTokenB, setValidationMessageTokenA],
    );
  };

  const handleTokenABalance = (value: string) => {
    setLastEditedInput(LastChangedToken.tokenA);
    tokensCalculations(
      value,
      pairInfo,
      [tokenA, tokenB],
      [tokenABalance, tokenBBalance],
      [setTokenAInput, setTokenBInput],
      [setValidationMessageTokenA, setValidationMessageTokenB],
    );
  };

  const handleTokenBBalance = (value: string) => {
    setLastEditedInput(LastChangedToken.tokenB);
    tokensCalculations(
      value,
      pairInfo,
      [tokenB, tokenA],
      [tokenBBalance, tokenABalance],
      [setTokenBInput, setTokenAInput],
      [setValidationMessageTokenB, setValidationMessageTokenA],
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
      const addPairTokenToTokenOperation = await addPairTokenToToken(
        tezos,
        dex,
        accountPkh,
        pairTokenA,
        pairTokenB,
        pairInputA,
        pairInputB
      );

      if (addPairTokenToTokenOperation) {
        return await confirmOperation(addPairTokenToTokenOperation.opHash, {
          message: getAddLiquidityMessage(pairTokenA.metadata.name, pairTokenA.metadata.name)
        });
      }
    } else {
      const addLiquidityTokenToTokenOperation = await addLiquidityTokenToToken(
        tezos,
        accountPkh,
        dex,
        pairInfo.id!,
        pairInputA,
        pairTokenA,
        pairTokenB,
        pairInfo.totalSupply,
        pairInfo.tokenAPool,
        pairInfo.tokenBPool
      );

      return await confirmOperation(addLiquidityTokenToTokenOperation.opHash, {
        message: getAddLiquidityMessage(pairTokenA.metadata.name, pairTokenB.metadata.name)
      });
    }
  };

  const investTezosToToken = async () => {
    if (!tezos || !accountPkh) {
      return;
    }

    const notTezToken = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenB : tokenA;
    const tezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenAInput : tokenBInput;
    const notTezTokenInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBInput : tokenAInput;
    const tezTokenBN = new BigNumber(tezTokenInput);
    const tezValue = toDecimals(tezTokenBN, TEZOS_TOKEN);

    const shouldAddLiquidity =
      pairInfo && pairInfo.tokenAPool.gt(EMPTY_POOL_AMOUNT) && pairInfo.tokenBPool.gt(EMPTY_POOL_AMOUNT);

    if (shouldAddLiquidity) {
      const addLiquidityTezOperation = await addLiquidityTez(tezos, dex, tezValue);

      return await confirmOperation(addLiquidityTezOperation.opHash, {
        message: getAddLiquidityMessage(TEZOS_TOKEN.metadata.name, notTezToken.metadata.name)
      });
    }

    const token: Token = {
      contract: notTezToken.contractAddress,
      id: notTezToken.fa2TokenId
    };
    const notTezTokenBN = new BigNumber(notTezTokenInput);
    const tokenBValue = toDecimals(notTezTokenBN, notTezToken);

    const initializeLiquidityTezOperation = await initializeLiquidityTez(
      tezos,
      networkId,
      token,
      tokenBValue,
      tezValue
    );

    return await confirmOperation(initializeLiquidityTezOperation.opHash, {
      message: getInitializeLiquidityMessage(TEZOS_TOKEN.metadata.name, notTezToken.metadata.name)
    });
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
