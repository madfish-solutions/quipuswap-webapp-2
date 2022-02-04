import React, { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';

import { RateView } from '@components/common/pair-details/rate-view';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useLoadLiquidityShare } from '@containers/liquidity/hooks/use-load-liquidity-share';
import { useLoadLpTokenBalance } from '@containers/liquidity/liquidity-cards/hooks';
import { useAccountPkh } from '@utils/dapp';
import { isExist, isNull } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { LiquidityDetailsButtons } from './components/liquidity-details-buttons';
import s from './liquidity-details.module.sass';
import { useLiquidityDetailsService } from './use-liqiudity-details.service';

interface Props {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
}

export const LiquidityDetails: FC<Props> = ({ dex, tokenA, tokenB }) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const accountPkh = useAccountPkh();
  const { share } = useLoadLiquidityShare(dex, tokenA, tokenB);
  const poolTotal = useLoadLpTokenBalance(dex, tokenA, tokenB);

  const { tokenASymbol, tokenBSymbol, sellPrice, buyPrice, fixedTokenAPoll, fixedTokenBPoll, pairLink, contractLink } =
    useLiquidityDetailsService(dex, tokenA, tokenB);

  return (
    <>
      <DetailsCardCell
        cellName={t('common|Sell Price')}
        tooltipContent={t(
          'common|The amount of {{tokenBSymbol}} you receive for 1 {{tokenASymbol}}, according to the current exchange rate.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={sellPrice} inputToken={tokenA} outputToken={tokenB} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Buy Price')}
        tooltipContent={t(
          'common|The amount of {{tokenASymbol}} you receive for 1 {{tokenBSymbol}}, according to the current exchange rate.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={buyPrice} inputToken={tokenB} outputToken={tokenA} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenASymbol}} Locked', { tokenASymbol })}
        tooltipContent={t('liquidity|The amount of {{tokenASymbol}} locked in the pool by liquidity providers.', {
          tokenASymbol
        })}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount
          balanceRule
          amount={fixedTokenAPoll}
          currency={tokenASymbol}
          isLoading={!isExist(dex) || !isExist(tokenA)}
          amountDecimals={tokenA?.metadata.decimals}
        />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenBSymbol}} Locked', { tokenBSymbol })}
        tooltipContent={t('liquidity|The amount of {{tokenBSymbol}} locked in the pool by liquidity providers.', {
          tokenBSymbol
        })}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount
          balanceRule
          amount={fixedTokenBPoll}
          currency={tokenBSymbol}
          isLoading={!isExist(dex) || !isExist(tokenB)}
          amountDecimals={tokenB?.metadata.decimals}
        />
      </DetailsCardCell>

      {accountPkh && (
        <>
          <DetailsCardCell
            cellName={t('liquidity|Your Total LP')}
            tooltipContent={t(
              "liquidity|Total amount of this pool's LP tokens you will own after adding liquidity. LP (liquidity Pool) tokens represent your current share in a pool."
            )}
            className={s.LiquidityDetails_CardCell}
          >
            <StateCurrencyAmount balanceRule amount={share?.total || null} isLoading={isNull(poolTotal)} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('liquidity|Your Frozen LP')}
            tooltipContent={t(
              'liquidity|Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.'
            )}
            className={s.LiquidityDetails_CardCell}
          >
            <StateCurrencyAmount balanceRule amount={share?.frozen || null} />
          </DetailsCardCell>
        </>
      )}

      <LiquidityDetailsButtons dex={dex} contractLink={contractLink} pairLink={pairLink} />
    </>
  );
};
