import { FC } from 'react';

import { DOLLAR } from '@config/constants';
import { DetailsCardCell, DashPlug, StateCurrencyAmount } from '@shared/components';
import { useTranslation } from '@translation';

import { useDetailsViewModel } from '../details';

type Props = ReturnType<typeof useDetailsViewModel>;

export const DetailsView: FC<Props> = ({
  apr,
  feesRate,
  tvlInUsd,
  isLoading,
  weeklyVolume,
  totalLpSupply,
  cardCellClassName
}) => {
  const { t } = useTranslation();

  return (
    <>
      <DetailsCardCell
        cellName={t('stableswap|tvl')}
        tooltipContent={t('stableswap|tvlPoolTooltip')}
        className={cardCellClassName}
        data-test-id="tvlInUsd"
      >
        <StateCurrencyAmount
          amount={tvlInUsd}
          dollarEquivalent={tvlInUsd}
          isLoading={isLoading}
          loaderFallback={<DashPlug />}
          currency={DOLLAR}
          dollarEquivalentOnly
          isLeftCurrency
        />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|weeklyVolume')}
        tooltipContent={t('stableswap|tvl')}
        className={cardCellClassName}
        data-test-id="tvlInUsd"
      >
        <StateCurrencyAmount amount={weeklyVolume} isLoading={isLoading} loaderFallback={<DashPlug />} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|Total LP Supply')}
        tooltipContent={t('stableswap|Total LP Supply')}
        className={cardCellClassName}
        data-test-id="tvlInUsd"
      >
        <StateCurrencyAmount amount={totalLpSupply} isLoading={isLoading} loaderFallback={<DashPlug />} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|fees')}
        tooltipContent={t('stableswap|fees')}
        className={cardCellClassName}
        data-test-id="tvlInUsd"
      >
        <StateCurrencyAmount amount={feesRate} isLoading={isLoading} loaderFallback={<DashPlug />} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|apr')}
        tooltipContent={t('stableswap|apr')}
        className={cardCellClassName}
        data-test-id="tvlInUsd"
      >
        <StateCurrencyAmount amount={apr} isLoading={isLoading} loaderFallback={<DashPlug />} />
      </DetailsCardCell>
    </>
  );
};
