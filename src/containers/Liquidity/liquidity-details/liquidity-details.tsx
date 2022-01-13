import React, { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Card, CardCell, Tooltip } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_ANALYTICS_PAIRS, TZKT_EXPLORER_URL } from '@app.config';
import { RateView } from '@components/common/pair-details/rate-view';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useLoadLiquidityShare } from '@containers/Liquidity/hooks/use-load-liquidity-share';
import { useLoadLpTokenBalance, usePairInfo } from '@containers/Liquidity/LiquidityForms/hooks';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { getRateByBalances } from '@utils/helpers/rates';
import { WhitelistedToken } from '@utils/types';

import { LiquidityDetailsButtons } from './components/liquidity-details-buttons';
import s from './liquidity-details.module.sass';

interface Props {
  dex: FoundDex;
  label: string;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
}

export const LiquidityDetails: FC<Props> = ({ dex, label, tokenA, tokenB }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const pairInfo = usePairInfo(dex, tokenA, tokenB);

  const tokenAName = getWhitelistedTokenSymbol(tokenA);
  const tokenBName = getWhitelistedTokenSymbol(tokenB);

  const balanceTotalA = pairInfo ? new BigNumber(pairInfo.tokenAPool) : null;
  const balanceTotalB = pairInfo ? new BigNumber(pairInfo.tokenBPool) : null;

  const sellPrice = balanceTotalA && balanceTotalB ? getRateByBalances(balanceTotalA, balanceTotalB) : null;
  const buyPrice = balanceTotalA && balanceTotalB ? getRateByBalances(balanceTotalB, balanceTotalA) : null;

  const poolTotal = useLoadLpTokenBalance(dex, tokenA, tokenB);

  const share = useLoadLiquidityShare(dex);

  const pairLink = dex ? `${QUIPUSWAP_ANALYTICS_PAIRS}/${dex.contract.address}` : null;
  const contractLink = dex ? `${TZKT_EXPLORER_URL}/${dex.contract.address}` : null;

  return (
    <Card
      header={{
        content: `${label} Liquidity Details`
      }}
      contentClassName={s.LiquidityDetails}
    >
      <CardCell
        header={
          <>
            {t('common|Sell Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of {{tokenBName}} you receive for 1 {{tokenAName}}, according to the current exchange rate.',
                { tokenAName, tokenBName }
              )}
            />
          </>
        }
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={sellPrice} inputToken={tokenA} outputToken={tokenB} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('common|Buy Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of {{tokenAName}} you receive for 1 {{tokenBName}}, according to the current exchange rate.',
                { tokenAName, tokenBName }
              )}
            />
          </>
        }
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={buyPrice} inputToken={tokenB} outputToken={tokenA} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|{{tokenAName}} Locked', { tokenAName })}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|The amount of {{tokenAName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
                { tokenAName }
              )}
            />
          </>
        }
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={balanceTotalA} currency={tokenAName} isLoading={!dex} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|{{tokenBName}} Locked', { tokenBName })}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|The amount of {{tokenBName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
                { tokenBName }
              )}
            />
          </>
        }
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={balanceTotalB} currency={tokenBName} isLoading={!dex} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|Your Total LP')}
            <Tooltip
              sizeT="small"
              content={t(
                "liquidity|Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool."
              )}
            />
          </>
        }
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={share?.total || null} currency="" isLoading={!poolTotal} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|Your Frozen LP')}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.'
              )}
            />
          </>
        }
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={share?.frozen || null} currency="" />
      </CardCell>

      <LiquidityDetailsButtons dex={dex} contractLink={contractLink} pairLink={pairLink} />
    </Card>
  );
};
