import React, {
  useState,
  Dispatch,
  useEffect,
  ChangeEvent,
  SetStateAction,
} from 'react';
import {
  Button,
  Tooltip,
  Switcher,
} from '@quipuswap/ui-kit';
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
  getValidPairParams,
} from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

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
  const [validTokenA, setValidTokenA] = useState<WhitelistedToken | null>(null);
  const [validTokenB, setValidTokenB] = useState<WhitelistedToken | null>(null);
  const [pairId, setPairId] = useState<BigNumber>();
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber,
    tokenAPool: BigNumber,
    tokenBPool: BigNumber,
  } | null>(null);

  useEffect(() => {
    const sortedTokens = sortTokensContracts(tokenA, tokenB);
    if (!sortedTokens) return;
    setValidTokenA(sortedTokens.addressA === tokenA.contractAddress ? tokenA : tokenB);
    setValidTokenB(sortedTokens.addressB === tokenB.contractAddress ? tokenB : tokenA);
  }, [tokenA, tokenB]);

  useEffect(() => {
    let isMounted = true;
    const loadPairData = async () => {
      if (!dex) return;

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) return;

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
            tokenBPool: pairDataTemp.token_b_pool,
          });
        }
      } else if (!pairIdTemp && isMounted) {
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
      && validTokenA
      && validTokenB
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenBAmount = tokenA.contractAddress === validTokenA.contractAddress
        ? calculateTokenAmount(
          new BigNumber(event.target.value).multipliedBy(decimalsA),
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        )
        : calculateTokenAmount(
          new BigNumber(event.target.value).multipliedBy(decimalsA),
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        );

      setTokenBInput(
        fromDecimals(tokenBAmount, tokenB.metadata.decimals)
          .toFixed(tokenB.metadata.decimals),
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
      && validTokenA
      && validTokenB
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenAAmount = tokenB.contractAddress === validTokenB.contractAddress
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
        fromDecimals(tokenAAmount, tokenA.metadata.decimals)
          .toFixed(validTokenA.metadata.decimals),
      );
    }
  };

  const handleTokenABalance = (value:string) => {
    const fixedValue = new BigNumber(value);

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));

    if (
      pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const tokenAmount = calculateTokenAmount(
        fixedValue,
        pairData.totalSupply,
        pairData.tokenAPool,
        pairData.tokenBPool,
      );

      setTokenBInput(
        fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
      );
    }
  };

  const handleTokenBBalance = (value:string) => {
    const fixedValue = new BigNumber(value);

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));

    if (
      pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const tezAmount = calculateTokenAmount(
        fixedValue,
        pairData.totalSupply,
        pairData.tokenBPool,
        pairData.tokenAPool,
      );

      setTokenAInput(
        fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !dex || !validTokenA || !validTokenB) return;
    const ten = new BigNumber(10);

    if (
      pairId
      && pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const shares = new BigNumber(tokenAInput)
        .multipliedBy(ten.pow(validTokenA.metadata.decimals))
        .multipliedBy(pairData.totalSupply)
        .idiv(pairData.tokenAPool);

      const tokenBIn = shares
        .multipliedBy(pairData.tokenBPool)
        .div(pairData.totalSupply);

      const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
      const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

      await dex.contract.methods.invest(
        pairId,
        shares,
        new BigNumber(tokenAInput).multipliedBy(ten.pow(validTokenA.metadata.decimals)),
        tokenBIn.integerValue(BigNumber.ROUND_CEIL),
        timestamp.toString(),
      ).send();
    } else if (validTokenA.contractAddress === tokenA.contractAddress) {
      const tokenAContract = await tezos.wallet.at(tokenA.contractAddress);
      const tokenBContract = await tezos.wallet.at(tokenB.contractAddress);

      const tokenADecimals = ten.pow(tokenA.metadata.decimals);
      const tokenBDecimals = ten.pow(tokenB.metadata.decimals);

      const validTokenAInput = new BigNumber(tokenAInput).multipliedBy(tokenADecimals);
      const validTokenBInput = new BigNumber(tokenBInput).multipliedBy(tokenBDecimals);

      const tokenAUpdateOperator = tokenA.type === 'fa1.2'
        ? tokenAContract.methods.approve(
          dex.contract.address,
          validTokenAInput,
        )
        : tokenAContract.methods.update_operators([{
          add_operator: {
            operator: dex.contract.address,
            owner: accountPkh,
            token_id: tokenA.fa2TokenId,
          },
        }]);
      const tokenBUpdateOperator = tokenB.type === 'fa1.2'
        ? tokenBContract.methods.approve(
          dex.contract.address,
          validTokenBInput,
        )
        : tokenBContract.methods.update_operators([{
          add_operator: {
            operator: dex.contract.address,
            owner: accountPkh,
            token_id: tokenB.fa2TokenId,
          },
        }]);

      const validAppPairParams = getValidPairParams(
        dex,
        tokenA,
        tokenB,
        validTokenAInput,
        validTokenBInput,
      );

      if (!validAppPairParams) return;

      const batch = await tezos.wallet.batch()
        .withContractCall(tokenAUpdateOperator)
        .withContractCall(tokenBUpdateOperator)
        .withContractCall(validAppPairParams);

      await batch.send();
    } else {
      console.log('x2');

      const tokenAContract = await tezos.wallet.at(validTokenA.contractAddress);
      const tokenBContract = await tezos.wallet.at(validTokenB.contractAddress);

      const tokenADecimals = ten.pow(validTokenA.metadata.decimals);
      const tokenBDecimals = ten.pow(validTokenB.metadata.decimals);

      const validTokenAInput = new BigNumber(tokenBInput).multipliedBy(tokenADecimals);
      const validTokenBInput = new BigNumber(tokenAInput).multipliedBy(tokenBDecimals);

      console.log('validTokenAInput', validTokenAInput.toFixed());
      console.log('validTokenBInput', validTokenBInput.toFixed());

      const tokenAUpdateOperator = validTokenA.type === 'fa1.2'
        ? tokenAContract.methods.approve(
          dex.contract.address,
          validTokenAInput,
        )
        : tokenAContract.methods.update_operators([{
          add_operator: {
            operator: dex.contract.address,
            owner: accountPkh,
            token_id: validTokenA.fa2TokenId,
          },
        }]);

      const tokenBUpdateOperator = validTokenB.type === 'fa1.2'
        ? tokenBContract.methods.approve(
          dex.contract.address,
          validTokenBInput,
        )
        : tokenBContract.methods.update_operators([{
          add_operator: {
            operator: dex.contract.address,
            owner: accountPkh,
            token_id: validTokenB.fa2TokenId,
          },
        }]);

      const validAppPairParams = getValidPairParams(
        dex,
        validTokenA,
        validTokenB,
        validTokenBInput,
        validTokenAInput,
      );
      if (!validAppPairParams) return;

      console.log({ validAppPairParams });

      const batch = await tezos.wallet.batch()
        .withContractCall(tokenAUpdateOperator)
        .withContractCall(tokenBUpdateOperator)
        .withContractCall(validAppPairParams);

      await batch.send();
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
      <div className={s.switcher}>
        <Switcher isActive={false} onChange={() => {}} />
        <span className={s.rebalance}>Rebalance Liq</span>
        <Tooltip content="Liquidity rebalace description" />
      </div>
      <Button
        className={s.button}
        onClick={handleAddLiquidity}
      >
        Add
      </Button>
    </>
  );
};
