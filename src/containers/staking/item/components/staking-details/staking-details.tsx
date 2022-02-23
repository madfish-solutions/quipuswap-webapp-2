import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

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

interface Props {
  isError: boolean;
}

export const StakingDetails: FC<Props> = observer(({ isError }) => {
  const { t } = useTranslation(['common', 'vote']);

  const {
    endTime,
    tvlDollarEquivalent,
    dailyDistribution,
    distributionDollarEquivalent,
    dailyApr,
    currentDelegate,
    nextDelegate,
    timelock,
    CardCellClassName,
    depositTokenDecimals,
    stakeUrl,
    stakeItem,
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
          amount={stakeItem?.tvl.toFixed() ?? null}
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
        <StatePercentage isLoading={isLoading} value={dailyApr} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Current Delegate')} tooltipContent={null} className={CardCellClassName}>
        <StateData isLoading={isLoading} data={currentDelegate}>
          {delegate => <CandidateButton candidate={delegate} />}
        </StateData>
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Next Delegate')} tooltipContent={null} className={CardCellClassName}>
        <StateData isLoading={isLoading} data={nextDelegate}>
          {delegate => <CandidateButton candidate={delegate} />}
        </StateData>
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|stakingEndsIn')} tooltipContent={null} className={CardCellClassName}>
        <StateData isLoading={isLoading} data={endTime}>
          {timestamp => <Countdown endTimestamp={timestamp} />}
        </StateData>
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Lock Period')} tooltipContent={null} className={CardCellClassName}>
        <StateData isLoading={isLoading} data={timelock}>
          {value => <TimespanView value={value} />}
        </StateData>
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Withdrawal Fee')} tooltipContent={null} className={CardCellClassName}>
        <StateData isLoading={isLoading} data={stakeItem?.withdrawalFee ?? null}>
          {withdrawalFee => <StatePercentage isLoading={false} value={withdrawalFee} />}
        </StateData>
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Interface Fee')} tooltipContent={null} className={CardCellClassName}>
        <StateData isLoading={isLoading} data={stakeItem?.harvestFee ?? null}>
          {harvestFee => <StatePercentage isLoading={false} value={harvestFee} />}
        </StateData>
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
          href={stakeUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Staking Contract')}
        </Button>
      </div>
    </Card>
  );
});
