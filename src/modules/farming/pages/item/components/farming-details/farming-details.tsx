import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button, CandidateButton, Card, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { ExternalLink } from '@shared/svg/external-link';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Countdown } from '../countdown';
import { StateData } from '../state-data';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './farming-details.module.scss';
import { useFarmingDetailsViewModel } from './use-farming-details.vm';

export const FarmingDetails: FC = observer(() => {
  const { t } = useTranslation(['farm']);

  const {
    endTime,
    tvlDollarEquivalent,
    dailyDistribution,
    distributionDollarEquivalent,
    apr,
    dailyApr,
    currentDelegate,
    nextDelegate,
    timelock,
    CardCellClassName,
    stakeUrl,
    stakedTokenSymbol,
    rewardTokenSymbol,
    tvl,
    withdrawalFee,
    harvestFee,
    depositTokenUrl,
    isLoading,
    isError,
    shouldShowDelegates,
    shouldShowLockPeriod,
    shouldShowWithdrawalFee,
    stakeStatus
  } = useFarmingDetailsViewModel();

  return (
    <Card
      header={{
        content: t('farm|Farming Details'),
        status: stakeStatus
      }}
      contentClassName={commonContainerStyles.content}
    >
      <DetailsCardCell
        cellName={t('farm|Value Locked')}
        className={CardCellClassName}
        tooltipContent={t('farm|valueLockedTooltip')}
      >
        <StateCurrencyAmount
          dollarEquivalent={tvlDollarEquivalent}
          currency={stakedTokenSymbol}
          amount={tvl}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('farm|Daily Distribution')}
        tooltipContent={t('farm|dailyDistributionTooltip')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount
          dollarEquivalent={distributionDollarEquivalent}
          currency={rewardTokenSymbol}
          amount={dailyDistribution}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('farm|APR')} tooltipContent={t('farm|aprTooltip')} className={CardCellClassName}>
        <StatePercentage value={apr} isLoading={isLoading} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('farm|dailyApr')}
        tooltipContent={t('farm|dailyAprTooltip')}
        className={CardCellClassName}
      >
        <StatePercentage isLoading={isLoading} value={dailyApr} />
      </DetailsCardCell>

      {shouldShowDelegates && (
        <>
          <DetailsCardCell
            cellName={t('farm|Current Delegate')}
            tooltipContent={t('farm|currentDelegateTooltip')}
            className={CardCellClassName}
          >
            <StateData isLoading={isLoading} data={currentDelegate}>
              {delegate => <CandidateButton candidate={delegate} />}
            </StateData>
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('farm|Next Delegate')}
            tooltipContent={t('farm|nextDelegateTooltip')}
            className={CardCellClassName}
          >
            <StateData isLoading={isLoading} data={nextDelegate}>
              {delegate => <CandidateButton candidate={delegate} />}
            </StateData>
          </DetailsCardCell>
        </>
      )}

      <DetailsCardCell
        cellName={t('farm|farmingEndsIn')}
        tooltipContent={t('farm|farmingEndsInTooltip')}
        className={CardCellClassName}
      >
        <StateData isLoading={isLoading} data={endTime}>
          {timestamp => <Countdown endTimestamp={timestamp} />}
        </StateData>
      </DetailsCardCell>

      {shouldShowLockPeriod && (
        <DetailsCardCell
          cellName={t('farm|Lock Period')}
          tooltipContent={t('farm|lockPeriodTooltip')}
          className={CardCellClassName}
        >
          <StateData isLoading={isLoading} data={timelock}>
            {value => <TimespanView value={value} />}
          </StateData>
        </DetailsCardCell>
      )}

      {shouldShowWithdrawalFee && (
        <DetailsCardCell
          cellName={t('farm|Withdrawal Fee')}
          tooltipContent={t('farm|withdrawalFeeTooltip')}
          className={CardCellClassName}
        >
          <StateData isLoading={isLoading} data={withdrawalFee}>
            {withdrawalFee => <StatePercentage isLoading={false} value={withdrawalFee} />}
          </StateData>
        </DetailsCardCell>
      )}

      <DetailsCardCell
        cellName={t('farm|Interface Fee')}
        tooltipContent={t('farm|interfaceFeeTooltip')}
        className={CardCellClassName}
      >
        <StateData isLoading={isLoading} data={harvestFee}>
          {harvestFee => <StatePercentage isLoading={false} value={harvestFee} />}
        </StateData>
      </DetailsCardCell>

      <div className={cx(commonContainerStyles.detailsButtons, styles.stakeDetailsButtons)}>
        <Button
          className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={depositTokenUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
        >
          {t('farm|Token Contract')}
        </Button>

        <Button
          className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={stakeUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
        >
          {t('farm|Farming Contract')}
        </Button>
      </div>
    </Card>
  );
});
