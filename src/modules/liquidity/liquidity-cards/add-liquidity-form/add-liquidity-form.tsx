import { FC } from 'react';

import cx from 'classnames';

import { AlarmMessage, Button, ConnectWalletButton, getBlackListedTokens, TokenSelect } from '@shared/components';
import { isTezIncluded, isExist, isUndefined } from '@shared/helpers';
import { Plus } from '@shared/svg';
import CC from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { LiquidityDeadline } from '../../liquidity-deadline';
import { LiquiditySlippage, LiquiditySlippageType } from '../../liquidity-slippage';
import styles from '../../liquidity.module.scss';
import { AddFormInterface } from './add-form.props';
import { useAddLiquidityService } from './use-add-liqudity.service';

export const AddLiquidityForm: FC<AddFormInterface> = ({
  dex,
  tokenA,
  tokenB,
  tokenALoading,
  tokenBLoading,
  onTokenAChange,
  onTokenBChange
}) => {
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
    isPoolNotExist,
    isSubmiting,
    handleSetTokenA,
    handleSetTokenB,
    handleTokenAChange,
    handleTokenBChange,
    handleTokenABalance,
    handleTokenBBalance,
    handleAddLiquidity
  } = useAddLiquidityService(dex, tokenA, tokenB, onTokenAChange, onTokenBChange);

  const isButtonDisabled =
    isSubmiting ||
    isUndefined(dex) ||
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

  const isDeadlineAndSkippageVisible = tokenA && tokenB && !isTezIncluded([tokenA, tokenB]);

  const fixedBalanceA = tokenABalance?.toFixed() ?? null;
  const fixedBalanceB = tokenBBalance?.toFixed() ?? null;

  return (
    <>
      <TokenSelect
        label="Input"
        balance={fixedBalanceA}
        token={tokenA}
        tokensLoading={tokenALoading}
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
      <Plus className={styles.iconButton} />
      <TokenSelect
        label="Input"
        balance={fixedBalanceB}
        token={tokenB}
        tokensLoading={tokenBLoading}
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
          <div className={styles['mt-24']}>
            <LiquiditySlippage
              liquidityType={LiquiditySlippageType.ADD}
              tokenA={tokenA}
              tokenB={tokenB}
              tokenAInput={tokenAInput}
              tokenBInput={tokenBInput}
              error={validationMessageSlippage}
            />
          </div>
          <div className={styles['mt-24']}>
            <LiquidityDeadline error={validationMessageDeadline} />
          </div>
        </>
      )}
      {isPoolNotExist && (
        <AlarmMessage
          message={t("liquidity|Note! The pool doesn't exist. You will create the new one.")}
          className={styles['mt-24']}
        />
      )}
      {accountPkh ? (
        <Button
          className={styles.button}
          onClick={handleAddLiquidity}
          disabled={isButtonDisabled}
          loading={isSubmiting}
        >
          Add
        </Button>
      ) : (
        <ConnectWalletButton className={cx(CC.connect, styles['mt-24'])} />
      )}
    </>
  );
};
