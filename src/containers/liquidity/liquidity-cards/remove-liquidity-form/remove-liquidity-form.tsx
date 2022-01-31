import React, { FC } from 'react';

import { ArrowDown, Plus } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { noop } from 'rxjs';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { Button } from '@components/ui/elements/button';
import CC from '@styles/CommonContainer.module.sass';
import { isExist, isTezIncluded } from '@utils/helpers';

import { LiquidityDeadline } from '../../liquidity-deadline';
import { LiquiditySlippage, LiquiditySlippageType } from '../../liquidity-slippage';
import s from '../../Liquidity.module.sass';
import { RemoveFormInterface } from './remove-form.props';
import { useRemoveLiquidityService } from './use-remove-liquidity.service';

export const RemoveLiquidityForm: FC<RemoveFormInterface> = ({ dex, tokenA, tokenB, onChangeTokensPair }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const {
    validatedInputMessage,
    validatedOutputMessageA,
    validatedOutputMessageB,
    validationMessageDeadline,
    validationMessageSlippage,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    share,
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
    isExist(validatedOutputMessageB) ||
    isExist(validationMessageDeadline) ||
    isExist(validationMessageSlippage);

  const blackListedTokens = getBlackListedTokens(tokenA, tokenB);
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const isDeadlineAndSlippageVisible = tokenA && tokenB && !isTezIncluded([tokenA, tokenB]);

  return (
    <>
      <PositionSelect
        label="Select LP"
        tokenPair={tokenPair}
        setTokenPair={handleSetTokenPair}
        balance={share?.unfrozen.toFixed() ?? null}
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
        balance={tokenABalance?.toFixed() ?? null}
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
        balance={tokenBBalance?.toFixed() ?? null}
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
          <div className={s['mt-24']}>
            <LiquiditySlippage
              liquidityType={LiquiditySlippageType.REMOVE}
              tokenA={tokenA}
              tokenB={tokenB}
              tokenAInput={tokenAOutput}
              tokenBInput={tokenBOutput}
              error={validationMessageSlippage}
            />
          </div>
          <div className={s['mt-24']}>
            <LiquidityDeadline error={validationMessageDeadline} />
          </div>
        </>
      )}
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
