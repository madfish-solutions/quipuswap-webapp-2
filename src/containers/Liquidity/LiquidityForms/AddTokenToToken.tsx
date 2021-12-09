import React, {
  useState,
  Dispatch,
  useEffect,
  ChangeEvent,
  SetStateAction,
} from 'react';
import { Button } from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import {
  sortTokensContracts,
  calculateTokenAmount,
  getValidMichelTemplate,
  allowContractSpendYourTokens,
} from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';
import { addPairTokenToToken } from '../liquidutyHelpers/addPairTokenToToken';

const MichelCodec = require('@taquito/michel-codec');

type AddTokenToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
};

export const AddTokenToToken:React.FC<AddTokenToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');
  const [tokenPairAndInputs, setTokenPairAndInputs] = useState<{
    pairTokenA: WhitelistedToken,
    pairTokenB: WhitelistedToken,
    pairInputA: string,
    pairInputB: string,
  } | null>(null);
  const [pairId, setPairId] = useState<BigNumber>();
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber,
    tokenAPool: BigNumber,
    tokenBPool: BigNumber,
  } | null>(null);

  useEffect(() => {
    const sortedTokens = sortTokensContracts(tokenA, tokenB);
    if (!sortedTokens) return;
    if (sortedTokens.addressA === tokenA.contractAddress) {
      setTokenPairAndInputs({
        pairTokenA: tokenA,
        pairTokenB: tokenB,
        pairInputA: tokenAInput,
        pairInputB: tokenBInput,
      });
    } else {
      setTokenPairAndInputs({
        pairTokenA: tokenB,
        pairTokenB: tokenA,
        pairInputA: tokenBInput,
        pairInputB: tokenAInput,
      });
    }
  }, [tokenA, tokenB]);

  useEffect(() => {
    let isMounted = true;
    const loadPairData = async () => {
      if (!dex) return;

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) return;

      const michelData = getValidMichelTemplate(addresses);
      const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

      const id = await dex.storage.storage.token_to_id.get(key);

      if (id) {
        const data = await dex.storage.storage.pairs.get(id);
        if (isMounted) {
          setPairId(id);
          setPairDataInfo({
            totalSupply: data.total_supply,
            tokenAPool: data.token_a_pool,
            tokenBPool: data.token_b_pool,
          });
        }
      } else if (!id && isMounted) {
        setPairDataInfo(null);
      }
    };
    loadPairData();
    return () => { isMounted = false; };
  }, [dex]);

  const handleTokenAInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    if (
      pairData
      && tokenPairAndInputs
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = new BigNumber(event.target.value).multipliedBy(decimalsA);
      const tokenBAmount = tokenA.contractAddress === tokenPairAndInputs.pairTokenA.contractAddress
        ? calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        )
        : calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        );

      setTokenBInput(
        fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
      );
    }
  };
  const handleTokenBInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    if (
      pairData
      && tokenPairAndInputs
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenAAmount = tokenB.contractAddress === tokenPairAndInputs.pairTokenB.contractAddress
        ? calculateTokenAmount(
          new BigNumber(event.target.value).multipliedBy(decimalsB),
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        )
        : calculateTokenAmount(
          new BigNumber(event.target.value).multipliedBy(decimalsB),
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        );

      setTokenAInput(
        fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleTokenABalance = (value:string) => {
    const tokenAAmount = new BigNumber(value);

    setTokenAInput(tokenAAmount.toFixed(tokenA.metadata.decimals));

    if (
      pairData
      && tokenPairAndInputs
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = tokenAAmount.multipliedBy(decimalsA);
      const tokenBAmount = tokenB.contractAddress === tokenPairAndInputs.pairTokenB.contractAddress
        ? calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        )
        : calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        );

      setTokenBInput(
        fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
      );
    }
  };
  const handleTokenBBalance = (value:string) => {
    const tokenBAmount = new BigNumber(value);

    setTokenBInput(tokenBAmount.toFixed(tokenB.metadata.decimals));

    if (
      pairData
      && tokenPairAndInputs
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBAmountWithDecimals = tokenBAmount.multipliedBy(decimalsB);
      const tokenAAmount = tokenA.contractAddress === tokenPairAndInputs.pairTokenA.contractAddress
        ? calculateTokenAmount(
          tokenBAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        )
        : calculateTokenAmount(
          tokenBAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        );

      setTokenAInput(
        fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !dex || !tokenPairAndInputs) return;
    const ten = new BigNumber(10);
    const {
      pairTokenA,
      pairTokenB,
      pairInputA,
      pairInputB,
    } = tokenPairAndInputs;

    if (
      pairId
      && pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      console.log({ pairTokenA });
      console.log({ pairTokenB });
      console.log({ pairInputA });
      console.log({ pairInputB });

      const shares = new BigNumber(pairInputA)
        .multipliedBy(ten.pow(pairTokenA.metadata.decimals))
        .multipliedBy(pairData.totalSupply)
        .idiv(pairData.tokenAPool);

      console.log('shares', shares.toFixed());

      const tokenAAmount = new BigNumber(tokenAInput)
        .multipliedBy(ten.pow(pairTokenA.metadata.decimals));

      const tokenBAmount = shares
        .multipliedBy(pairData.tokenBPool)
        .div(pairData.totalSupply)
        .integerValue(BigNumber.ROUND_CEIL);

      const tokenAUpdateOperator = await allowContractSpendYourTokens(
        tezos,
        pairTokenA,
        dex.contract.address,
        tokenAAmount,
        accountPkh,
      );
      if (!tokenAUpdateOperator) return;

      const tokenBUpdateOperator = await allowContractSpendYourTokens(
        tezos,
        pairTokenB,
        dex.contract.address,
        tokenBAmount,
        accountPkh,
      );
      if (!tokenBUpdateOperator) return;

      const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
      const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

      const investParams = await dex.contract.methods.invest(
        pairId,
        shares,
        tokenAAmount,
        tokenBAmount,
        timestamp.toString(),
      );

      const batch = await tezos.wallet.batch()
        .withContractCall(tokenAUpdateOperator)
        .withContractCall(tokenBUpdateOperator)
        .withContractCall(investParams);

      await batch.send();
    } else {
      addPairTokenToToken(
        tezos,
        dex,
        accountPkh,
        pairTokenA,
        pairTokenB,
        pairInputA,
        pairInputB,
      );
    }
  };

  return (
    <>
      <TokenSelect
        label="Input"
        balance={tokenABalance}
        token={tokenA}
        setToken={setTokenA}
        value={tokenAInput}
        onInput={handleTokenAInput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={handleTokenABalance}
        noBalanceButtons={!accountPkh}
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={tokenBBalance}
        token={tokenB}
        setToken={setTokenB}
        value={tokenBInput}
        onInput={handleTokenBInput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={handleTokenBBalance}
        noBalanceButtons={!accountPkh}
      />
      <Button
        className={s.button}
        onClick={handleAddLiquidity}
      >
        Add
      </Button>
    </>
  );
};
