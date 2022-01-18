import React, { FC } from 'react';

import { Button } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NewPairMessage } from '@components/common/new-pair-message';
import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { isTezIncludes } from '@containers/liquidity/liquidity-cards/helpers';
import { DeadlineInput } from '@containers/swap-send/components/deadline-input';
import CC from '@styles/CommonContainer.module.sass';
import { fromDecimals } from '@utils/helpers';

import { LiquiditySlippage, LiquiditySlippageType } from '../../liquidity-slippage';
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
    slippage,
    setSlippage,
    isNewPair,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  } = useAddLiquidityService(dex, tokenA, tokenB, transactionDuration, onTokenAChange, onTokenBChange);

  const { decimals: decimalsA } = tokenA?.metadata ?? { decimals: null };
  const { decimals: decimalsB } = tokenB?.metadata ?? { decimals: null };

  const isButtonDisabled =
    !dex ||
    !accountPkh ||
    !tokenA ||
    !tokenB ||
    !tokenAInput ||
    !tokenBInput ||
    Boolean(validationMessageTokenA) ||
    Boolean(validationMessageTokenB) ||
    Boolean(validationMessageTransactionDuration);
  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const balanceTokenA = decimalsA ? fromDecimals(tokenABalance ?? DEFAULT_BALANCE_BN, decimalsA).toFixed() : null;
  const balanceTokenB = decimalsB ? fromDecimals(tokenBBalance ?? DEFAULT_BALANCE_BN, decimalsB).toFixed() : null;

  const isDeadlineAndSkippageVisible = tokenA && tokenB && !isTezIncludes([tokenA, tokenB]);

  return (
    <>
      <TokenSelect
        label="Input"
        balance={balanceTokenA}
        token={tokenA}
        setToken={handleSetTokenA}
        value={tokenAInput}
        onChange={handleTokenAChange}
        blackListedTokens={blackListedTokens}
        handleBalance={handleTokenABalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        error={validationMessageTokenA}
        disabled={!tokenB}
        placeholder="0.0"
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={balanceTokenB}
        token={tokenB}
        setToken={handleSetTokenB}
        value={tokenBInput}
        onChange={handleTokenBChange}
        blackListedTokens={blackListedTokens}
        handleBalance={handleTokenBBalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        error={validationMessageTokenB}
        disabled={!tokenA}
        placeholder="0.0"
      />
      {isDeadlineAndSkippageVisible && (
        <>
          <div className={CC.mt24}>
            <DeadlineInput
              onChange={setTransactionDuration}
              error={validationMessageTransactionDuration}
              value={transactionDuration}
            />
          </div>
          <div className={CC.mt24}>
            <LiquiditySlippage
              liquidityType={LiquiditySlippageType.ADD}
              tokenA={tokenA}
              tokenB={tokenB}
              tokenAInput={tokenAInput}
              tokenBInput={tokenBInput}
              slippage={slippage}
              onChange={setSlippage}
            />
          </div>
        </>
      )}
      {isNewPair && <NewPairMessage className={CC.mt24} />}
      {accountPkh ? (
        <Button className={s.button} onClick={handleAddLiquidity} disabled={isButtonDisabled}>
          Add
        </Button>
      ) : (
        <ConnectWalletButton className={cx(CC.connect, s['mt-24'])} />
      )}
    </>
  );
};
