import React from 'react';

import { Plus, Button, ArrowDown } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { RemoveFormInterface } from '@containers/Liquidity/LiquidityForms/remove-liquidity-form/remove-form.props';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
import { fromDecimals, noOpFunc } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { useRemoveLiquidityService } from './use-remove-liquidity-service';

export const RemoveLiquidityForm: React.FC<RemoveFormInterface> = ({ dex, tokenA, tokenB, onChangeTokensPair }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const {
    errorMessage,
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
  } = useRemoveLiquidityService(dex, tokenA, tokenB, onChangeTokensPair);

  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={fromDecimals(lpTokenBalance, LP_TOKEN_DECIMALS).toFixed(LP_TOKEN_DECIMALS)}
        handleBalance={handleBalance}
        noBalanceButtons={!accountPkh}
        onChange={handleChange}
        value={lpTokenInput}
        balanceLabel={t('vote|Available balance')}
        notFrozen
        id="liquidity-remove-input"
        className={s.input}
        error={accountPkh ? errorMessage : undefined}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={fromDecimals(tokenABalance, decimalsA).toFixed(decimalsA)}
        token={tokenA}
        value={tokenAOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        placeholder="0.0"
        noBalanceButtons
        disabled
        notSelectable
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={fromDecimals(tokenBBalance, decimalsB).toFixed(decimalsB)}
        token={tokenB}
        value={tokenBOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        placeholder="0.0"
        noBalanceButtons
        disabled
        notSelectable
      />
      <Button
        className={s.button}
        onClick={handleRemoveLiquidity}
        disabled={!accountPkh || Boolean(errorMessage) || !lpTokenInput}
      >
        Remove
      </Button>
    </>
  );
};
