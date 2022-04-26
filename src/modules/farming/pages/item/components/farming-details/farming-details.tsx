import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button, CandidateButton, Card, DetailsCardCell, StateCurrencyAmount, StatusLabel } from '@shared/components';
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
    timeLockLabel,
    shouldShowTags,
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
      data-test-id="farmingDetails"
    >
      {shouldShowTags && (
        <DetailsCardCell cellName={t('farm|Tags')} className={CardCellClassName} data-test-id="tags">
          <div className={styles.tags}>
            {shouldShowLockPeriod && <StatusLabel label={`${timeLockLabel} LOCK`} status={stakeStatus} />}
            {shouldShowWithdrawalFee && <StatusLabel label={`${withdrawalFee}% UNLOCK FEE`} status={stakeStatus} />}
          </div>
        </DetailsCardCell>
      )}

      <DetailsCardCell
        cellName={t('farm|Value Locked')}
        className={CardCellClassName}
        tooltipContent={t('farm|valueLockedTooltip')}
        data-test-id="valueLocked"
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
        data-test-id="dailyDistribution"
      >
        <StateCurrencyAmount
          dollarEquivalent={distributionDollarEquivalent}
          currency={rewardTokenSymbol}
          amount={dailyDistribution}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('farm|APR')}
        tooltipContent={t('farm|aprTooltip')}
        className={CardCellClassName}
        data-test-id="APR"
      >
        <StatePercentage value={apr} isLoading={isLoading} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('farm|dailyApr')}
        tooltipContent={t('farm|dailyAprTooltip')}
        className={CardCellClassName}
        data-test-id="dailyApr"
      >
        <StatePercentage isLoading={isLoading} value={dailyApr} />
      </DetailsCardCell>

      {shouldShowDelegates && (
        <>
          <DetailsCardCell
            cellName={t('farm|Current Delegate')}
            tooltipContent={t('farm|currentDelegateTooltip')}
            className={CardCellClassName}
            data-test-id="currentDelegate"
          >
            <StateData isLoading={isLoading} data={currentDelegate}>
              {delegate => <CandidateButton candidate={delegate} />}
            </StateData>
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('farm|Next Delegate')}
            tooltipContent={t('farm|nextDelegateTooltip')}
            className={CardCellClassName}
            data-test-id="nextDelegate"
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
        data-test-id="farmingEndsIn"
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
          data-test-id="lockPeriod"
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
          data-test-id="withdrawalFee"
        >
          <StateData isLoading={isLoading} data={withdrawalFee}>
            {_withdrawalFee => <StatePercentage isLoading={false} value={_withdrawalFee} />}
          </StateData>
        </DetailsCardCell>
      )}

      <DetailsCardCell
        cellName={t('farm|Interface Fee')}
        tooltipContent={t('farm|interfaceFeeTooltip')}
        className={CardCellClassName}
        data-test-id="interfaceFee"
      >
        <StateData isLoading={isLoading} data={harvestFee}>
          {_harvestFee => <StatePercentage isLoading={false} value={_harvestFee} />}
        </StateData>
      </DetailsCardCell>

      <div className={cx(commonContainerStyles.detailsButtons, styles.stakeDetailsButtons)}>
        <Button
          className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={depositTokenUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
          data-test-id="tokenContract"
        >
          {t('farm|Token Contract')}
        </Button>

        <Button
          className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={stakeUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
          data-test-id="farmingContract"
        >
          {t('farm|Farming Contract')}
        </Button>
      </div>
    </Card>
  );
});
