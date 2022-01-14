import React from 'react';

import { ArrowDown, Button, Plus } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { DeadlineInput } from '@containers/swap-send/components/deadline-input';
import CC from '@styles/CommonContainer.module.sass';
import { fromDecimals } from '@utils/helpers';

import { LiquiditySlippage, LiquiditySlippageType } from '../../liquidity-slippage';
import s from '../../Liquidity.module.sass';
import { isTezIncludes } from '../helpers';
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
    lpTokenBalance,
    slippage,
    setSlippage,
    handleRemoveLiquidity,
    handleChange,
    handleBalance,
    handleSetTokenPair
  } = useRemoveLiquidityService(dex, tokenA, tokenB, onChangeTokensPair, transactionDuration);

  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const isButtonDisabled =
    !accountPkh ||
    !lpTokenInput ||
    Boolean(validatedInputMessage) ||
    Boolean(validatedOutputMessageA) ||
    Boolean(validatedOutputMessageB) ||
    Boolean(validationMessageTransactionDuration);
  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);
  const isDeadlineVisible = !isTezIncludes([tokenA, tokenB]);

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={lpTokenBalance?.toFixed()}
        handleBalance={handleBalance}
        shouldShowBalanceButtons={shouldShowBalanceButtons}
        onChange={handleChange}
        value={lpTokenInput}
        balanceLabel={t('vote|Available balance')}
        notFrozen
        id="liquidity-remove-input"
        className={s.input}
        error={validatedInputMessage}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={fromDecimals(tokenABalance ?? DEFAULT_BALANCE_BN, decimalsA).toFixed()}
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
        balance={fromDecimals(tokenBBalance ?? DEFAULT_BALANCE_BN, decimalsB).toFixed()}
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
      {isDeadlineVisible && (
        <div className={CC.mt24}>
          <DeadlineInput
            onChange={setTransactionDuration}
            value={transactionDuration}
            error={validationMessageTransactionDuration}
          />
        </div>
      )}
      <div className={CC.mt24}>
        <LiquiditySlippage
          type={LiquiditySlippageType.REMOVE}
          tokenA={tokenA}
          tokenB={tokenB}
          tokenAInput={tokenAOutput}
          tokenBInput={tokenBOutput}
          slippage={slippage}
          onChange={setSlippage}
        />
      </div>
      {accountPkh ? (
        <Button className={s.button} onClick={handleRemoveLiquidity} disabled={isButtonDisabled}>
          Remove
        </Button>
      ) : (
        <ConnectWalletButton className={cx(CC.connect, s['mt-24'])} />
      )}
    </>
  );
};
