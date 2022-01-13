import React, { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_ANALYTICS_PAIRS, TZKT_EXPLORER_URL } from '@app.config';
import { RateView } from '@components/common/pair-details/rate-view';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useLoadLiquidityShare } from '@containers/liquidity/hooks/use-load-liquidity-share';
import { useLoadLpTokenBalance, usePairInfo } from '@containers/liquidity/liquidity-cards/hooks';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { getRateByBalances } from '@utils/helpers/rates';
import { WhitelistedToken } from '@utils/types';

import { LiquidityDetailsButtons } from './components/liquidity-details-buttons';
import s from './liquidity-details.module.sass';

interface Props {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
}

export const LiquidityDetails: FC<Props> = ({ dex, tokenA, tokenB }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const pairInfo = usePairInfo(dex, tokenA, tokenB);

  const tokenAName = getWhitelistedTokenSymbol(tokenA);
  const tokenBName = getWhitelistedTokenSymbol(tokenB);

  const balanceTotalA = pairInfo ? pairInfo.tokenAPool : null;
  const balanceTotalB = pairInfo ? pairInfo.tokenBPool : null;

  const sellPrice = balanceTotalA && balanceTotalB ? getRateByBalances(balanceTotalA, balanceTotalB) : null;
  const buyPrice = balanceTotalA && balanceTotalB ? getRateByBalances(balanceTotalB, balanceTotalA) : null;

  const poolTotal = useLoadLpTokenBalance(dex, tokenA, tokenB);

  const share = useLoadLiquidityShare(dex);

  const pairLink = dex ? `${QUIPUSWAP_ANALYTICS_PAIRS}/${dex.contract.address}` : null;
  const contractLink = dex ? `${TZKT_EXPLORER_URL}/${dex.contract.address}` : null;

  return (
    <>
      <DetailsCardCell
        cellName={t('common|Sell Price')}
        tooltipContent={t(
          'common|The amount of {{tokenBName}} you receive for 1 {{tokenAName}}, according to the current exchange rate.',
          { tokenAName, tokenBName }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={sellPrice} inputToken={tokenA} outputToken={tokenB} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Buy Price')}
        tooltipContent={t(
          'common|The amount of {{tokenAName}} you receive for 1 {{tokenBName}}, according to the current exchange rate.',
          { tokenAName, tokenBName }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={buyPrice} inputToken={tokenB} outputToken={tokenA} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenAName}} Locked', { tokenAName })}
        tooltipContent={t(
          'liquidity|The amount of {{tokenAName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
          { tokenAName }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={balanceTotalA} currency={tokenAName} isLoading={!dex} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenBName}} Locked', { tokenBName })}
        tooltipContent={t(
          'liquidity|The amount of {{tokenBName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
          { tokenBName }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={balanceTotalB} currency={tokenBName} isLoading={!dex} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|Your Total LP')}
        tooltipContent={t(
          "liquidity|Total amount of this pool's LP tokens you will own after adding liquidity. LP (liquidity Pool) tokens represent your current share in a pool."
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={share?.total || null} isLoading={!poolTotal} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|Your Frozen LP')}
        tooltipContent={t(
          'liquidity|Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.'
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount amount={share?.frozen || null} />
      </DetailsCardCell>

      <LiquidityDetailsButtons dex={dex} contractLink={contractLink} pairLink={pairLink} />
    </>
  );
};
