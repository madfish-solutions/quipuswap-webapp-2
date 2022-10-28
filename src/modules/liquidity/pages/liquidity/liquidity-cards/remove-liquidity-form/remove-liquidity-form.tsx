import { FC } from 'react';

import cx from 'classnames';
import { noop } from 'rxjs';

import {
  AlarmMessage,
  Button,
  ConnectWalletButton,
  getBlackListedTokens,
  PositionSelect,
  TokenSelect
} from '@shared/components';
import { isExist, isTezIncluded } from '@shared/helpers';
import { ArrowDown, Plus } from '@shared/svg';
import CC from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../../liquidity.module.scss';
import { SlippageInfo, LiquiditySlippageType } from '../../slippage-info';
import { RemoveFormInterface } from './remove-form.props';
import { useRemoveLiquidityService } from './use-remove-liquidity.service';

export const RemoveLiquidityForm: FC<RemoveFormInterface> = ({ dex, tokenA, tokenB, onChangeTokensPair }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const {
    validatedInputMessage,
    validatedOutputMessageA,
    validatedOutputMessageB,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    share,
    isPoolNotExist,
    isTokenChanging,
    isSubmiting,
    setIsTokenChanging,
    handleRemoveLiquidity,
    handleChange,
    handleBalance,
    handleSetTokenPair
  } = useRemoveLiquidityService(dex, tokenA, tokenB, onChangeTokensPair);

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

  const isDeadlineAndSlippageVisible = tokenA && tokenB && !isTezIncluded([tokenA, tokenB]);

  const isTezInPair = tokenA && tokenB && !isTezIncluded([tokenA, tokenB]);

  const fixedBalanceA = tokenABalance?.toFixed() ?? null;
  const fixedBalanceB = tokenBBalance?.toFixed() ?? null;
  const fixedUnfrozenBalance = share?.unfrozen.toFixed();
  const fixedFrozenBalance = share?.frozen.toFixed();

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={fixedUnfrozenBalance}
        handleBalance={handleBalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        onChange={handleChange}
        value={lpTokenInput}
        balanceLabel={t('common|Available balance')}
        frozenBalance={fixedFrozenBalance}
        notFrozen={Boolean(isTezInPair)}
        id="liquidity-remove-input"
        className={styles.input}
        error={validatedInputMessage}
        isPoolNotExists={isPoolNotExist}
        tokensUpdating={{ isTokenChanging, setIsTokenChanging }}
      />
      <ArrowDown className={styles.iconButton} />
      <TokenSelect
        label="Output"
        balance={fixedBalanceA}
        token={tokenA}
        value={tokenAOutput}
        blackListedTokens={blackListedTokens}
        handleBalance={noop}
        shouldShowBalanceButtons={false}
        placeholder="0.0"
        error={validatedOutputMessageA}
        disabled
        notSelectable
        data-test-id="outputA"
      />
      <Plus className={styles.iconButton} />
      <TokenSelect
        label="Output"
        balance={fixedBalanceB}
        token={tokenB}
        value={tokenBOutput}
        blackListedTokens={blackListedTokens}
        handleBalance={noop}
        shouldShowBalanceButtons={false}
        error={validatedOutputMessageB}
        placeholder="0.0"
        disabled
        notSelectable
        data-test-id="outputB"
      />
      {isDeadlineAndSlippageVisible && (
        <div className={styles['mt-24']}>
          <SlippageInfo
            liquidityType={LiquiditySlippageType.REMOVE}
            tokenA={tokenA}
            tokenB={tokenB}
            tokenAInput={tokenAOutput}
            tokenBInput={tokenBOutput}
          />
        </div>
      )}
      {isPoolNotExist && (
        <AlarmMessage message={t("liquidity|Note! The pool doesn't exist")} className={styles['mt-24']} />
      )}
      {accountPkh ? (
        <Button
          className={styles.button}
          onClick={handleRemoveLiquidity}
          disabled={isButtonDisabled}
          loading={isSubmiting}
          data-test-id="removeButton"
        >
          Remove
        </Button>
      ) : (
        <ConnectWalletButton className={cx(CC.connect, styles['mt-24'])} />
      )}
    </>
  );
};
