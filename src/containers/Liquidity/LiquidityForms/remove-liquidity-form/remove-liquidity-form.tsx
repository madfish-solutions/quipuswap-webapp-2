import React from 'react';

import { Plus, Button, ArrowDown } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { isTezInPair } from '@containers/Liquidity/LiquidityForms/helpers';
import { DeadlineInput } from '@containers/swap-send/components/deadline-input';
import { fromDecimals } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
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
  const isDeadlineVisible = !isTezInPair(tokenA.contractAddress, tokenB.contractAddress);

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={fromDecimals(lpTokenBalance, LP_TOKEN_DECIMALS).toFixed()}
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
        <div className={s.deadline}>
          <DeadlineInput
            onChange={setTransactionDuration}
            value={transactionDuration}
            error={validationMessageTransactionDuration}
          />
        </div>
      )}
      <Button className={s.button} onClick={handleRemoveLiquidity} disabled={isButtonDisabled}>
        Remove
      </Button>
    </>
  );
};
