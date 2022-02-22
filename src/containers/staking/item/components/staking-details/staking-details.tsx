import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { MS_IN_SECOND, STAKING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@app.config';
import { DashPlug } from '@components/ui/dash-plug';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import s from '@styles/CommonContainer.module.sass';

import { Countdown } from '../countdown';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './staking-details.module.sass';
import { useStakingDetailsViewModel } from './use-staking-details.vm';

interface Props {
  isError: boolean;
}

export const StakingDetails: FC<Props> = observer(({ isError }) => {
  const { t } = useTranslation(['common', 'vote']);

  const {
    stakeItem,
    currentDelegate,
    nextDelegate,
    endTimestamp,
    tvlDollarEquivalent,
    CardCellClassName,
    tokensTvl,
    depositTokenDecimals,
    distributionDollarEquivalent,
    dailyDistribution,
    isLoading
  } = useStakingDetailsViewModel();

  return (
    <Card
      header={{
        content: t('stake|Stake Details')
      }}
      contentClassName={s.content}
    >
      <DetailsCardCell cellName={t('stake|Value Locked')} className={CardCellClassName} tooltipContent={null}>
        <StateCurrencyAmount
          balanceRule
          dollarEquivalent={tvlDollarEquivalent}
          currency={stakeItem?.stakedToken.metadata.symbol}
          amount={tokensTvl}
          amountDecimals={depositTokenDecimals}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Daily Distribution')} tooltipContent={null} className={CardCellClassName}>
        <StateCurrencyAmount
          balanceRule
          dollarEquivalent={distributionDollarEquivalent}
          currency={stakeItem?.rewardToken.metadata.symbol}
          amount={dailyDistribution?.toFixed() ?? null}
          amountDecimals={stakeItem?.rewardToken.metadata.decimals}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|APR')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage value={stakeItem?.apr?.toFixed() ?? null} isLoading={isLoading} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|dailyApr')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={isLoading} value={stakeItem?.apr?.dividedBy(365).toFixed() ?? null} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Current Delegate')} tooltipContent={null} className={CardCellClassName}>
        {currentDelegate ? <CandidateButton candidate={currentDelegate} /> : <DashPlug animation={isLoading} />}
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Next Delegate')} tooltipContent={null} className={CardCellClassName}>
        {nextDelegate ? <CandidateButton candidate={nextDelegate} /> : <DashPlug animation={isLoading} />}
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|stakingEndsIn')} tooltipContent={null} className={CardCellClassName}>
        {endTimestamp ? <Countdown endTimestamp={endTimestamp} /> : <DashPlug animation={isLoading} />}
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Lock Period')} tooltipContent={null} className={CardCellClassName}>
        {stakeItem ? <TimespanView value={stakeItem.timelock * MS_IN_SECOND} /> : <DashPlug animation={isLoading} />}
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Withdrawal Fee')} tooltipContent={null} className={CardCellClassName}>
        {stakeItem ? (
          <StatePercentage isLoading={false} value={stakeItem.withdrawalFee} />
        ) : (
          <DashPlug animation={isLoading} />
        )}
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Interface Fee')} tooltipContent={null} className={CardCellClassName}>
        {stakeItem ? (
          <StatePercentage isLoading={false} value={stakeItem.harvestFee} />
        ) : (
          <DashPlug animation={isLoading} />
        )}
      </DetailsCardCell>

      <div className={cx(s.detailsButtons, styles.stakeDetailsButtons)}>
        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={stakeItem?.depositTokenUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Token Contract')}
        </Button>

        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={stakeItem?.stakeUrl ?? `${TZKT_EXPLORER_URL}/${STAKING_CONTRACT_ADDRESS}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Staking Contract')}
        </Button>
      </div>
    </Card>
  );
});
