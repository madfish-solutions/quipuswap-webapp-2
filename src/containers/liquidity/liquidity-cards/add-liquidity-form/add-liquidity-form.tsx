import React, { FC } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { AlarmMessage } from '@components/common/alarm-message';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { Button } from '@components/ui/elements/button';
import { isTezIncluded } from '@containers/liquidity/liquidity-cards/helpers';
import CC from '@styles/CommonContainer.module.sass';
import { fromDecimals, isExist } from '@utils/helpers';

import { LiquidityDeadline } from '../../liquidity-deadline';
import { LiquiditySlippage, LiquiditySlippageType } from '../../liquidity-slippage';
import s from '../../Liquidity.module.sass';
import { AddFormInterface } from './add-form.props';
import { useAddLiquidityService } from './use-add-liqudity.service';

const DEFAULT_BALANCE = 0;
const DEFAULT_BALANCE_BN = new BigNumber(DEFAULT_BALANCE);

export const AddLiquidityForm: FC<AddFormInterface> = ({ dex, tokenA, tokenB, onTokenAChange, onTokenBChange }) => {
  const { t } = useTranslation(['liquidity']);
  const {
    validationMessageTokenA,
    validationMessageTokenB,
    validationMessageDeadline,
    validationMessageSlippage,
    accountPkh,
    tokenABalance,
    tokenBBalance,
    tokenAInput,
    tokenBInput,
    isNewPair,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  } = useAddLiquidityService(dex, tokenA, tokenB, onTokenAChange, onTokenBChange);

  const { decimals: decimalsA } = tokenA?.metadata ?? { decimals: null };
  const { decimals: decimalsB } = tokenB?.metadata ?? { decimals: null };

  const isButtonDisabled =
    !dex ||
    !accountPkh ||
    !tokenA ||
    !tokenB ||
    !tokenAInput ||
    !tokenBInput ||
    isExist(validationMessageTokenA) ||
    isExist(validationMessageTokenB) ||
    isExist(validationMessageDeadline) ||
    isExist(validationMessageSlippage);

  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const balanceTokenA = decimalsA ? fromDecimals(tokenABalance ?? DEFAULT_BALANCE_BN, decimalsA).toFixed() : null;
  const balanceTokenB = decimalsB ? fromDecimals(tokenBBalance ?? DEFAULT_BALANCE_BN, decimalsB).toFixed() : null;

  const isDeadlineAndSkippageVisible = tokenA && tokenB && !isTezIncluded([tokenA, tokenB]);

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
          <div className={s['mt-24']}>
            <LiquidityDeadline error={validationMessageDeadline} />
          </div>
          <div className={s['mt-24']}>
            <LiquiditySlippage
              liquidityType={LiquiditySlippageType.ADD}
              tokenA={tokenA}
              tokenB={tokenB}
              tokenAInput={tokenAInput}
              tokenBInput={tokenBInput}
              error={validationMessageSlippage}
            />
          </div>
        </>
      )}
      {isNewPair && (
        <AlarmMessage
          message={t("liquidity|Note! The pool doesn't exist. You will create the new one.")}
          className={s['mt-24']}
        />
      )}
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
