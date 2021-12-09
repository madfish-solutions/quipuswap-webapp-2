import React, {
  useState,
  Dispatch,
  useEffect,
  ChangeEvent,
  SetStateAction,
} from 'react';
import {
  Plus,
  Button,
  ArrowDown,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import { fromDecimals, noOpFunc } from '@utils/helpers';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import { sortTokensContracts, getValidMichelTemplate } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

const MichelCodec = require('@taquito/michel-codec');

type RemoveTokenToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
};

export const RemoveTokenToToken: React.FC<RemoveTokenToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
  lpTokenBalance,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [pairId, setPairId] = useState();
  const [lpTokenInput, setLpTokenInput] = useState('');
  const [tokenAOutput, setTokenAOutput] = useState('');
  const [tokenBOutput, setTokenBOutput] = useState('');
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber,
    tokenAPool: BigNumber,
    tokenBPool: BigNumber,
  } | null>(null);

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
      } else {
        setPairDataInfo(null);
      }
    };
    loadPairData();
    return () => { isMounted = false; };
  }, [dex]);

  useEffect(() => {
    if (!dex || !pairData) return;
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');
      return;
    }
    const addresses = sortTokensContracts(tokenA, tokenB);
    if (!addresses) return;

    const tokenAPerOneLp = addresses.addressA === tokenA.contractAddress
      ? pairData.tokenAPool.dividedBy(pairData.totalSupply)
      : pairData.tokenBPool.dividedBy(pairData.totalSupply);
    const tokenBPerOneLp = addresses.addressB === tokenB.contractAddress
      ? pairData.tokenBPool.dividedBy(pairData.totalSupply)
      : pairData.tokenAPool.dividedBy(pairData.totalSupply);

    const lpInputWithDecimals = new BigNumber(10).pow(6).multipliedBy(lpTokenInput);

    const tokenAOut = tokenAPerOneLp
      .multipliedBy(lpInputWithDecimals);
    const tokenBOut = tokenBPerOneLp
      .multipliedBy(lpInputWithDecimals);

    setTokenAOutput(
      fromDecimals(tokenAOut, tokenA.metadata.decimals)
        .toFixed(tokenA.metadata.decimals),
    );
    setTokenBOutput(
      fromDecimals(tokenBOut, tokenB.metadata.decimals)
        .toFixed(tokenB.metadata.decimals),
    );
  }, [lpTokenInput, dex, pairData]);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) return;

    const ten = new BigNumber(10);

    const shares = new BigNumber(lpTokenInput).multipliedBy(ten.pow(LP_TOKEN_DECIMALS));
    const tokenAOut = new BigNumber(tokenAOutput)
      .multipliedBy(ten.pow(tokenA.metadata.decimals));
    const tokenBOut = new BigNumber(tokenBOutput)
      .multipliedBy(ten.pow(tokenB.metadata.decimals));

    const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
    const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

    const addresses = sortTokensContracts(tokenA, tokenB);

    if (!addresses) return;
    if (addresses.addressA === tokenA.contractAddress) {
      await dex.contract.methods.divest(
        pairId,
        tokenAOut,
        tokenBOut,
        shares,
        timestamp.toString(),
      ).send();
    } else {
      await dex.contract.methods.divest(
        pairId,
        tokenBOut,
        tokenAOut,
        shares,
        timestamp.toString(),
      ).send();
    }

    setLpTokenInput('');
  };

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={tokenA}
        token2={tokenB}
        setToken={setTokenB}
        value={lpTokenInput}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value)}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={(value) => {
          const fixedValue = new BigNumber(value);
          setLpTokenInput(fixedValue.toFixed());
        }}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenABalance}
        token={tokenA}
        setToken={setTokenA}
        value={tokenAOutput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenBBalance}
        token={tokenB}
        setToken={setTokenB}
        value={tokenBOutput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Button
        className={s.button}
        onClick={handleRemoveLiquidity}
        disabled={!accountPkh}
      >
        Remove
      </Button>
    </>
  );
};
