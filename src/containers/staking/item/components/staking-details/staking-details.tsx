import { FC } from 'react';

import { ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { CardStake } from '@components/ui/card/card-stake';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import s from '@styles/CommonContainer.module.sass';

import { Countdown } from '../countdown';
import { StateData } from '../state-data';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './staking-details.module.sass';
import { useStakingDetailsViewModel } from './use-staking-details.vm';

export const StakingDetails: FC = observer(() => {
  const { t } = useTranslation(['common', 'vote']);

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
    <CardStake
      header={{
        content: t('stake|Stake Details')
      }}
      contentClassName={s.content}
      stakeStatus={stakeStatus}
    >
      <DetailsCardCell
        cellName={t('stake|Value Locked')}
        className={CardCellClassName}
        tooltipContent={t('stake|valueLockedTooltip')}
      >
        <StateCurrencyAmount
          dollarEquivalent={tvlDollarEquivalent}
          currency={stakedTokenSymbol}
          amount={tvl}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|Daily Distribution')}
        tooltipContent={t('stake|dailyDistributionTooltip')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount
          dollarEquivalent={distributionDollarEquivalent}
          currency={rewardTokenSymbol}
          amount={dailyDistribution}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|APR')} tooltipContent={t('stake|aprTooltip')} className={CardCellClassName}>
        <StatePercentage value={apr} isLoading={isLoading} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|dailyApr')}
        tooltipContent={t('stake|dailyAprTooltip')}
        className={CardCellClassName}
      >
        <StatePercentage isLoading={isLoading} value={dailyApr} />
      </DetailsCardCell>

      {shouldShowDelegates && (
        <>
          <DetailsCardCell
            cellName={t('stake|Current Delegate')}
            tooltipContent={t('stake|currentDelegateTooltip')}
            className={CardCellClassName}
          >
            <StateData isLoading={isLoading} data={currentDelegate}>
              {delegate => <CandidateButton candidate={delegate} />}
            </StateData>
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('stake|Next Delegate')}
            tooltipContent={t('stake|nextDelegateTooltip')}
            className={CardCellClassName}
          >
            <StateData isLoading={isLoading} data={nextDelegate}>
              {delegate => <CandidateButton candidate={delegate} />}
            </StateData>
          </DetailsCardCell>
        </>
      )}

      <DetailsCardCell
        cellName={t('stake|stakingEndsIn')}
        tooltipContent={t('stake|stakingEndsInTooltip')}
        className={CardCellClassName}
      >
        <StateData isLoading={isLoading} data={endTime}>
          {timestamp => <Countdown endTimestamp={timestamp} />}
        </StateData>
      </DetailsCardCell>

      {shouldShowLockPeriod && (
        <DetailsCardCell
          cellName={t('stake|Lock Period')}
          tooltipContent={t('stake|lockPeriodTooltip')}
          className={CardCellClassName}
        >
          <StateData isLoading={isLoading} data={timelock}>
            {value => <TimespanView value={value} />}
          </StateData>
        </DetailsCardCell>
      )}

      {shouldShowWithdrawalFee && (
        <DetailsCardCell
          cellName={t('stake|Withdrawal Fee')}
          tooltipContent={t('stake|withdrawalFeeTooltip')}
          className={CardCellClassName}
        >
          <StateData isLoading={isLoading} data={withdrawalFee}>
            {withdrawalFee => <StatePercentage isLoading={false} value={withdrawalFee} />}
          </StateData>
        </DetailsCardCell>
      )}

      <DetailsCardCell
        cellName={t('stake|Interface Fee')}
        tooltipContent={t('stake|interfaceFeeTooltip')}
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
          {t('stake|Token Contract')}
        </Button>

        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={stakeUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Staking Contract')}
        </Button>
      </div>
    </CardStake>
  );
});
