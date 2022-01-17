import React, { FC } from 'react';

import { Button } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { Plus } from '@components/svg/Plus';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import CC from '@styles/CommonContainer.module.sass';
import { fromDecimals } from '@utils/helpers';

import s from '../../Liquidity.module.sass';
import { AddFormInterface } from './add-form.props';
import { useAddLiquidityService } from './use-add-liqudity.service';

const DEFAULT_BALANCE = 0;
const DEFAULT_BALANCE_BN = new BigNumber(DEFAULT_BALANCE);

export const AddLiquidityForm: FC<AddFormInterface> = ({ dex, tokenA, tokenB, onTokenAChange, onTokenBChange }) => {
  const {
    validationMessageTokenA,
    validationMessageTokenB,
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
  } = useAddLiquidityService(dex, tokenA, tokenB, onTokenAChange, onTokenBChange);

  const { decimals: decimalsA } = tokenA?.metadata ?? { decimals: null };
  const { decimals: decimalsB } = tokenB?.metadata ?? { decimals: null };

  const isButtonDisabled =
    !accountPkh ||
    !dex ||
    !tokenA ||
    !tokenB ||
    Boolean(validationMessageTokenA) ||
    Boolean(validationMessageTokenB) ||
    !tokenAInput ||
    !tokenBInput;
  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const balanceTokenA = decimalsA ? fromDecimals(tokenABalance ?? DEFAULT_BALANCE_BN, decimalsA).toFixed() : null;
  const balanceTokenB = decimalsB ? fromDecimals(tokenBBalance ?? DEFAULT_BALANCE_BN, decimalsB).toFixed() : null;

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
