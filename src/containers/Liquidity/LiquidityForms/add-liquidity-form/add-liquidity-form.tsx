import React, { FC } from 'react';

import { Button } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { isTezInPair } from '@containers/Liquidity/LiquidityForms/helpers';
import { DeadlineInput } from '@containers/swap-send/components/deadline-input';
import { fromDecimals } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { AddFormInterface } from './add-form.props';
import { useAddLiquidityService } from './use-add-liqudity.service';

const DEFAULT_BALANCE = 0;
const DEFAULT_BALANCE_BN = new BigNumber(DEFAULT_BALANCE);

export const AddLiquidityForm: FC<AddFormInterface> = ({
  dex,
  tokenA,
  tokenB,
  onTokenAChange,
  onTokenBChange,
  transactionDuration,
  setTransactionDuration
}) => {
  const {
    validationMessageTokenA,
    validationMessageTokenB,
    validationMessageTransactionDuration,
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
  } = useAddLiquidityService(dex, tokenA, tokenB, onTokenAChange, onTokenBChange, transactionDuration);

  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const isButtonDisabled =
    !accountPkh ||
    !tokenAInput ||
    !tokenBInput ||
    Boolean(validationMessageTokenA) ||
    Boolean(validationMessageTokenB) ||
    Boolean(validationMessageTransactionDuration);
  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);
  const isDeadlineVisible = !isTezInPair(tokenA.contractAddress, tokenB.contractAddress);

  return (
    <>
      <TokenSelect
        label="Input"
        balance={fromDecimals(tokenABalance ?? DEFAULT_BALANCE_BN, decimalsA).toFixed()}
        token={tokenA}
        setToken={handleSetTokenA}
        value={tokenAInput}
        onChange={handleTokenAChange}
        blackListedTokens={blackListedTokens}
        handleBalance={handleTokenABalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        error={validationMessageTokenA}
        placeholder="0.0"
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={fromDecimals(tokenBBalance ?? DEFAULT_BALANCE_BN, decimalsB).toFixed()}
        token={tokenB}
        setToken={handleSetTokenB}
        value={tokenBInput}
        onChange={handleTokenBChange}
        blackListedTokens={blackListedTokens}
        handleBalance={handleTokenBBalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        error={validationMessageTokenB}
        placeholder="0.0"
      />
      {isDeadlineVisible && (
        <div className={s.deadline}>
          <DeadlineInput
            onChange={setTransactionDuration}
            error={validationMessageTransactionDuration}
            value={transactionDuration}
          />
        </div>
      )}
      <Button className={s.button} onClick={handleAddLiquidity} disabled={isButtonDisabled}>
        Add
      </Button>
    </>
  );
};
