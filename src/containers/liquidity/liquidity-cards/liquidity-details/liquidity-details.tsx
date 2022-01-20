import React, { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_ANALYTICS_PAIRS, TZKT_EXPLORER_URL } from '@app.config';
import { RateView } from '@components/common/pair-details/rate-view';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useLoadLiquidityShare } from '@containers/liquidity/hooks/use-load-liquidity-share';
import { calculatePoolAmount } from '@containers/liquidity/liquidity-cards/helpers/calculate-pool-amount';
import { useLoadLpTokenBalance, usePairInfo } from '@containers/liquidity/liquidity-cards/hooks';
import { useAccountPkh } from '@utils/dapp';
import { getWhitelistedTokenSymbol, isExist, isNull } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { LiquidityDetailsButtons } from './components/liquidity-details-buttons';
import s from './liquidity-details.module.sass';

const ONE_TOKEN = 1;
const ONE_TOKEN_BN = new BigNumber(ONE_TOKEN);

interface Props {
  dex: Nullable<FoundDex>;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
}

export const LiquidityDetails: FC<Props> = ({ dex, tokenA, tokenB }) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const accountPkh = useAccountPkh();

  const { pairInfo } = usePairInfo(dex, tokenA, tokenB);

  const isTokensOrderValid = tokenA?.contractAddress === pairInfo?.tokenA.contractAddress;

  const tokenAPool = isTokensOrderValid ? pairInfo?.tokenAPool ?? null : pairInfo?.tokenBPool ?? null;
  const tokenBPool = isTokensOrderValid ? pairInfo?.tokenBPool ?? null : pairInfo?.tokenAPool ?? null;

  const tokenAName = tokenA ? getWhitelistedTokenSymbol(tokenA) : null;
  const tokenBName = tokenB ? getWhitelistedTokenSymbol(tokenB) : null;

  const sellPrice = calculatePoolAmount(ONE_TOKEN_BN, tokenA, tokenB, tokenAPool, tokenBPool);
  const buyPrice = calculatePoolAmount(ONE_TOKEN_BN, tokenB, tokenA, tokenBPool, tokenAPool);

  const poolTotal = useLoadLpTokenBalance(dex, tokenA, tokenB);

  const { share } = useLoadLiquidityShare(dex, tokenA, tokenB);

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
        <StateCurrencyAmount
          amount={tokenAPool}
          currency={tokenAName}
          isLoading={isExist(dex) || isExist(tokenA)}
          amountDecimals={tokenA?.metadata.decimals}
        />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenBName}} Locked', { tokenBName })}
        tooltipContent={t(
          'liquidity|The amount of {{tokenBName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
          { tokenBName }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount
          amount={tokenBPool}
          currency={tokenBName}
          isLoading={isExist(dex) || isExist(tokenB)}
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
            <StateCurrencyAmount amount={share?.total || null} isLoading={isNull(poolTotal)} />
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
        </>
      )}

      <LiquidityDetailsButtons dex={dex} contractLink={contractLink} pairLink={pairLink} />
    </>
  );
};
