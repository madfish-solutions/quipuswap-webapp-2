import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DOLLAR, PERCENT } from '@config/constants';
import { PieChartQs } from '@shared/charts';
import { Button, DashPlug, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './dex-two-details-view.module.scss';

interface Props {
  feesRate: BigNumber;
  tvlInUsd: BigNumber;
  isLoading: boolean;
  totalLpSupply: BigNumber;
  poolContractUrl: string;
  cardCellClassName: string;
  pieChartData: Array<{ value: number; tokenSymbol: string }>;
}

export const DexTwoDetailsView: FC<Props> = ({
  feesRate,
  tvlInUsd,
  isLoading,
  pieChartData,
  totalLpSupply,
  poolContractUrl,
  cardCellClassName
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.cellsWrapper}>
        <DetailsCardCell
          cellName={t('stableswap|tvl')}
          tooltipContent={t('stableswap|tvlPoolTooltip')}
          className={cardCellClassName}
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
        <DetailsCardCell
          cellName={t('stableswap|Total LP Supply')}
          tooltipContent={t('stableswap|totalLPSupply')}
          className={cardCellClassName}
          data-test-id="totalLpSupply"
        >
          <StateCurrencyAmount amount={totalLpSupply} isLoading={isLoading} loaderFallback={<DashPlug />} />
        </DetailsCardCell>
        <DetailsCardCell
          cellName={t('stableswap|feesRate')}
          tooltipContent={t('stableswap|feesRate')}
          className={cardCellClassName}
          data-test-id="feesRate"
        >
          <StateCurrencyAmount
            amount={feesRate}
            isLoading={isLoading}
            loaderFallback={<DashPlug />}
            currency={PERCENT}
          />
        </DetailsCardCell>
      </div>
      <PieChartQs data={pieChartData} />
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
