import { useTranslation } from 'next-i18next';
import React from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { estimateTezInToken, estimateTokenInTez, FoundDex } from '@quipuswap/sdk';

import {
  fromDecimals,
  getWhitelistedTokenDecimals,
  parseTezDecimals,
  slippageToBignum,
  toDecimals,
} from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { ICurrentTab, LiquidityFormValues, WhitelistedToken } from '@utils/types';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from '../../Liquidity.module.sass';

interface LiquidityRebalanceProps {
  dex?: FoundDex;
  values: LiquidityFormValues;
  token2: WhitelistedToken;
  currentTab: ICurrentTab;
  tokenAName: string;
  tokenBName: string;
  rebalanceSwitcher: boolean;
}

export const LiquidityRebalance: React.FC<LiquidityRebalanceProps> = ({
  dex,
  values,
  token2,
  currentTab,
  tokenAName,
  tokenBName,
  rebalanceSwitcher,
}) => {
  const { t } = useTranslation(['liquidity']);
  if (currentTab.id !== 'add' || !rebalanceSwitcher) {
    return null;
  }
  let maxInvestedA = new BigNumber(0);
  let maxInvestedB = new BigNumber(0);
  if (dex) {
    const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
    const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
    try {
      const initialAto$ = toDecimals(bal1, getWhitelistedTokenDecimals(TEZOS_TOKEN));
      const initialBto$ = estimateTezInToken(
        dex.storage,
        toDecimals(bal2, getWhitelistedTokenDecimals(token2)),
      );
      const total$ = initialAto$.plus(initialBto$).idiv(2);
      const totalA = fromDecimals(total$, getWhitelistedTokenDecimals(TEZOS_TOKEN));
      const totalB = fromDecimals(
        estimateTokenInTez(dex.storage, total$),
        getWhitelistedTokenDecimals(token2),
      );
      maxInvestedA = totalA.minus(slippageToBignum(values.slippage).times(totalA));
      maxInvestedB = totalB.minus(slippageToBignum(values.slippage).times(totalB));
    } catch (e) {
      maxInvestedA = bal1;
      maxInvestedB = bal2;
    }
  }
  const maxA = parseTezDecimals(maxInvestedA.toString());
  const maxB = parseTezDecimals(maxInvestedB.toString());
  return (
    <>
      <div className={s.receive}>
        <span className={s.receiveLabel}>{t('liquidity|Max invested')}:</span>
        <CurrencyAmount currency={tokenAName} amount={maxA} />
      </div>
      <div className={cx(s.receive, s.mb24)}>
        <span className={s.receiveLabel}>{t('liquidity|Max invested')}:</span>
        <CurrencyAmount currency={tokenBName} amount={maxB} />
      </div>
    </>
  );
};
