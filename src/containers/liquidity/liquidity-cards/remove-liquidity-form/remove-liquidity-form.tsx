import React from 'react';

import { ArrowDown, Button, Plus } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { DeadlineInput } from '@components/common/deadline-input/deadline-input';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import CC from '@styles/CommonContainer.module.sass';
import { fromDecimals, isExist } from '@utils/helpers';

import { LiquiditySlippage, LiquiditySlippageType } from '../../liquidity-slippage';
import s from '../../Liquidity.module.sass';
import { isTezIncluded } from '../helpers';
import { RemoveFormInterface } from './remove-form.props';
import { useRemoveLiquidityService } from './use-remove-liquidity.service';

const DEFAULT_BALANCE = 0;
const DEFAULT_BALANCE_BN = new BigNumber(DEFAULT_BALANCE);

export const RemoveLiquidityForm: React.FC<RemoveFormInterface> = ({
  dex,
  tokenA,
  tokenB,
  onChangeTokensPair,
  transactionDuration,
  setTransactionDuration
}) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const {
    validatedInputMessage,
    validatedOutputMessageA,
    validatedOutputMessageB,
    validationMessageTransactionDuration,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    share,
    slippage,
    setSlippage,
    handleRemoveLiquidity,
    handleChange,
    handleBalance,
    handleSetTokenPair
  } = useRemoveLiquidityService(dex, tokenA, tokenB, transactionDuration, onChangeTokensPair);

  const { decimals: decimalsA } = tokenA?.metadata ?? { decimals: null };
  const { decimals: decimalsB } = tokenB?.metadata ?? { decimals: null };

  const isButtonDisabled =
    !dex ||
    !tokenA ||
    !tokenB ||
    !accountPkh ||
    !lpTokenInput ||
    isExist(validatedInputMessage) ||
    isExist(validatedOutputMessageA) ||
    isExist(validatedOutputMessageB);

  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const balanceTokenA = decimalsA ? fromDecimals(tokenABalance ?? DEFAULT_BALANCE_BN, decimalsA).toFixed() : null;
  const balanceTokenB = decimalsB ? fromDecimals(tokenBBalance ?? DEFAULT_BALANCE_BN, decimalsB).toFixed() : null;

  const isDeadlineAndSlippageVisible = tokenA && tokenB && !isTezIncluded([tokenA, tokenB]);
  const isUnvoteVisible = !isDeadlineAndSlippageVisible && share && new BigNumber(lpTokenInput).gt(share.unfrozen);

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={share?.total.toFixed()}
        handleBalance={handleBalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        onChange={handleChange}
        value={lpTokenInput}
        balanceLabel={t('vote|Available balance')}
        frozenBalance={share?.frozen.toFixed()}
        id="liquidity-remove-input"
        className={s.input}
        error={validatedInputMessage}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={balanceTokenA}
        token={tokenA}
        value={tokenAOutput}
        blackListedTokens={blackListedTokens}
        handleBalance={noop}
        shouldShowBalanceButtons={false}
        placeholder="0.0"
        error={validatedOutputMessageA}
        disabled
        notSelectable
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={balanceTokenB}
        token={tokenB}
        value={tokenBOutput}
        blackListedTokens={blackListedTokens}
        handleBalance={noop}
        shouldShowBalanceButtons={false}
        error={validatedOutputMessageB}
        placeholder="0.0"
        disabled
        notSelectable
      />
      {isDeadlineAndSlippageVisible && (
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
              tokenAInput={tokenAOutput}
              tokenBInput={tokenBOutput}
              slippage={slippage}
              onChange={setSlippage}
            />
          </div>
        </>
      )}
      {accountPkh ? (
        <Button className={s.button} onClick={handleRemoveLiquidity} disabled={isButtonDisabled}>
          Remove {isUnvoteVisible && '& Unvote'}
        </Button>
      ) : (
        <ConnectWalletButton className={cx(CC.connect, s['mt-24'])} />
      )}
    </>
  );
};
