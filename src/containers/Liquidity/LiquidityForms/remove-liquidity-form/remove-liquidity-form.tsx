import React from 'react';

import { Plus, Button, ArrowDown } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { RemoveFormInterface } from '@containers/Liquidity/LiquidityForms/remove-liquidity-form/remove-form.props';
import { noOpFunc } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { useRemoveLiquidityService } from './use-remove-liquidity-service';

export const RemoveLiquidityForm: React.FC<RemoveFormInterface> = ({ dex, tokenA, tokenB, onChangeTokensPair }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const {
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

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={lpTokenBalance}
        handleBalance={handleBalance}
        noBalanceButtons={!accountPkh}
        onChange={handleChange}
        value={lpTokenInput}
        balanceLabel={t('vote|Available balance')}
        notFrozen
        id="liquidity-remove-input"
        className={s.input}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenABalance}
        token={tokenA}
        value={tokenAOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
        notSelectable
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenBBalance}
        token={tokenB}
        value={tokenBOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
        notSelectable
      />
      <Button className={s.button} onClick={handleRemoveLiquidity} disabled={!accountPkh}>
        Remove
      </Button>
    </>
  );
};
