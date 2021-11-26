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
  Slippage,
  ArrowDown,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import { WhitelistedToken } from '@utils/types';
import { getValidMichelTemplate, noOpFunc, sortTokensContracts } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

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
    const tokenAPerOneLp = pairData.tokenAPool
      .dividedBy(pairData.totalSupply);

    const tokenBPerOneLp = pairData.tokenBPool
      .dividedBy(pairData.totalSupply);

    setTokenAOutput(tokenAPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
    setTokenBOutput(tokenBPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
  }, [lpTokenInput, dex, pairData]);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) return;

    const shares = new BigNumber(lpTokenInput).multipliedBy(1_000_000);
    const tokenAOut = new BigNumber(tokenAOutput).multipliedBy(1_000_000);
    const tokenBOut = new BigNumber(tokenBOutput).multipliedBy(1_000_000);

    await dex.contract.methods.divest(
      pairId,
      tokenAOut,
      tokenBOut,
      shares,
    ).send();

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
      <Slippage handleChange={noOpFunc} />
      <Button
        className={s.button}
        onClick={handleRemoveLiquidity}
      >
        Remove
      </Button>
    </>
  );
};
