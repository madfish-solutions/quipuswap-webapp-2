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
import { noOpFunc } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import { removeLiquidity } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

type RemoveTezToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
};

export const RemoveTezToToken: React.FC<RemoveTezToTokenProps> = ({
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

  const [lpTokenInput, setLpTokenInput] = useState('');
  const [tokenAOutput, setTokenAOutput] = useState('');
  const [tokenBOutput, setTokenBOutput] = useState('');

  useEffect(() => {
    if (!dex) return;
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');
      return;
    }

    const tezPerOneLp = dex.storage.storage.tez_pool
      .dividedBy(dex.storage.storage.total_supply);

    const quipuPerOneLp = dex.storage.storage.token_pool
      .dividedBy(dex.storage.storage.total_supply);

    setTokenAOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
    setTokenBOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
  }, [lpTokenInput, dex, tokenA, tokenB]);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) return;

    await removeLiquidity(
      tezos,
      dex,
      new BigNumber(lpTokenInput),
      new BigNumber(0.1),
    );
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
