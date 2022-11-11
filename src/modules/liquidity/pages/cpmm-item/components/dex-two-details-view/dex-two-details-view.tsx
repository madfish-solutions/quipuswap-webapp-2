import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR } from '@config/constants';
import { PieChart, PieChartQs } from '@shared/charts';
import { Button, CandidateButton, DashPlug, DetailsCardCell, StateCurrencyAmount, StateData } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import { LedEntity, Nullable, Optional, WhitelistedBaker } from '@shared/types';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './dex-two-details-view.module.scss';

interface Props {
  canHaveBaker?: boolean;
  currentBaker: LedEntity<Nullable<WhitelistedBaker>>;
  isLoading: boolean;
  poolContractUrl: string;
  cardCellClassName: string;
  apr: Optional<BigNumber>;
  feesRate: Optional<BigNumber>;
  tvlInUsd: Optional<BigNumber>;
  weeklyVolume: Optional<BigNumber>;
  totalLpSupply: Optional<BigNumber>;
  liquidityChartData: Array<PieChart>;
}

export const DexTwoDetailsView: FC<Props> = ({
  apr,
  weeklyVolume,
  feesRate,
  tvlInUsd,
  isLoading,
  liquidityChartData,
  totalLpSupply,
  poolContractUrl,
  cardCellClassName,
  canHaveBaker,
  currentBaker
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.cellsWrapper}>
        <DetailsCardCell
          cellName={t('stableswap|tvl')}
          className={cardCellClassName}
          tooltipContent={t('liquidity|tvlTooltip')}
          data-test-id="tvlInUsd"
        >
          <StateCurrencyAmount
            amount={tvlInUsd}
            isLoading={isLoading}
            dollarEquivalent={tvlInUsd}
            loaderFallback={<DashPlug />}
            currency={DOLLAR}
            dollarEquivalentOnly
            isLeftCurrency
          />
        </DetailsCardCell>
        {weeklyVolume && (
          <DetailsCardCell
            cellName={t('stableswap|weeklyVolume')}
            className={cardCellClassName}
            tooltipContent={t('liquidity|weeklyVolumeTooltip')}
            data-test-id="weeklyVolume"
          >
            <StateCurrencyAmount amount={weeklyVolume} isLoading={isLoading} loaderFallback={<DashPlug />} />
          </DetailsCardCell>
        )}
        <DetailsCardCell
          cellName={t('stableswap|Total LP Supply')}
          className={cardCellClassName}
          tooltipContent={t('liquidity|totalLpSupplyTooltip')}
          data-test-id="totalLpSupply"
        >
          <StateCurrencyAmount amount={totalLpSupply} isLoading={isLoading} loaderFallback={<DashPlug />} />
        </DetailsCardCell>
        {canHaveBaker && (
          <DetailsCardCell
            cellName={t('liquidity|currentBaker')}
            className={cardCellClassName}
            tooltipContent={t('liquidity|currentBakerTooltip')}
            data-test-id="currentBaker"
          >
            <StateData entity={currentBaker}>{candidate => <CandidateButton candidate={candidate} />}</StateData>
          </DetailsCardCell>
        )}
        {feesRate && (
          <DetailsCardCell
            cellName={t('stableswap|feesRate')}
            className={cardCellClassName}
            tooltipContent={t('liquidity|feesRateTooltip')}
            data-test-id="feesRate"
          >
            <StateCurrencyAmount amount={feesRate} isLoading={isLoading} loaderFallback={<DashPlug />} />
          </DetailsCardCell>
        )}
        {apr && (
          <DetailsCardCell
            cellName={t('stableswap|apr')}
            className={cardCellClassName}
            tooltipContent={t('liquidity|aprTooltip')}
            data-test-id="apr"
          >
            <StateCurrencyAmount amount={apr} isLoading={isLoading} loaderFallback={<DashPlug />} />
          </DetailsCardCell>
        )}
      </div>
      <PieChartQs data={liquidityChartData} />
      <div className={commonContainerStyles.detailsButtons}>
        <Button
          className={commonContainerStyles.detailsButton}
          theme="inverse"
          href={poolContractUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
          data-test-id="stableswapContractButton"
        >
          {t('liquidity|Pair Contract')}
        </Button>
      </div>
    </>
  );
};
