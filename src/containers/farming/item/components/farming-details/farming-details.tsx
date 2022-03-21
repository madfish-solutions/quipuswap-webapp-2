import { FC } from 'react';

import { ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { Card } from '@components/ui/card/card';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import s from '@styles/CommonContainer.module.sass';

import { Countdown } from '../countdown';
import { StateData } from '../state-data';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './farming-details.module.sass';
import { useStakingDetailsViewModel } from './use-farming-details.vm';

export const StakingDetails: FC = observer(() => {
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
  } = useStakingDetailsViewModel();

  return (
    <Card
      header={{
        content: t('farm|Farm Details'),
        status: stakeStatus
      }}
      contentClassName={s.content}
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
        cellName={t('farm|stakingEndsIn')}
        tooltipContent={t('farm|stakingEndsInTooltip')}
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

      <div className={cx(s.detailsButtons, styles.stakeDetailsButtons)}>
        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={depositTokenUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('farm|Token Contract')}
        </Button>

        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={stakeUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('farm|Farm Contract')}
        </Button>
      </div>
    </Card>
  );
});
