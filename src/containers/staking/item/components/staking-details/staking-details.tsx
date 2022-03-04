import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { MS_IN_SECOND, STAKING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@app.config';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { getDollarEquivalent } from '@containers/staking/list/helpers';
import { CandidateButton } from '@containers/voiting/components';
import { StakingItem } from '@interfaces/staking.interfaces';
import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { Optional } from '@utils/types';

import { Countdown } from '../countdown';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './staking-details.module.sass';

const endTimestamp = Date.now() + 90069 * MS_IN_SECOND;

interface Props {
  item: Optional<StakingItem>;
  isError: boolean;
}

export const StakingDetails: FC<Props> = ({ item, isError }) => {
  const { t } = useTranslation(['common', 'vote', 'stake']);
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  const tvlDollarEquivalent = item && getDollarEquivalent(item.tvl, item.depositExchangeRate);
  const tokenBSymbol = item?.tokenB ? 'TOKEN' : item?.tokenA.metadata.symbol;
  const tvl = item?.tvl ?? null;
  const rewardTokenAmount = 1000;
  const distributionDollarEquivalent = item && getDollarEquivalent(rewardTokenAmount, item.earnExchangeRate);
  const rewardTokenSymbol = item?.rewardToken.metadata.symbol;

  const isLoading = !isError && !item;

  return (
    <Card
      header={{
        content: t('stake|Stake Details')
      }}
      contentClassName={s.content}
    >
      <DetailsCardCell
        cellName={t('stake|Value Locked')}
        className={CardCellClassName}
        tooltipContent={t('stake|valueLockedTooltip')}
      >
        <StateCurrencyAmount
          dollarEquivalent={tvlDollarEquivalent}
          currency={tokenBSymbol}
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
          amount={rewardTokenAmount}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|APR')} tooltipContent={t('stake|aprTooltip')} className={CardCellClassName}>
        <StatePercentage value={item?.apr?.toFixed() ?? null} isLoading={isLoading} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|dailyApr')}
        tooltipContent={t('stake|dailyAprTooltip')}
        className={CardCellClassName}
      >
        <StatePercentage isLoading={!isError && !item} value={item?.apr?.dividedBy(365).toFixed() ?? null} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|Current Delegate')}
        tooltipContent={t('stake|currentDelegateTooltip')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={bakers[0]} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|Next Delegate')}
        tooltipContent={t('stake|nextDelegateTooltip')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={bakers[1]} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|stakingEndsIn')}
        tooltipContent={t('stake|stakingEndsInTooltip')}
        className={CardCellClassName}
      >
        <Countdown endTimestamp={endTimestamp} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|Lock Period')}
        tooltipContent={t('stake|lockPeriodTooltip')}
        className={CardCellClassName}
      >
        <TimespanView value={86400 * MS_IN_SECOND} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|Withdrawal Fee')}
        tooltipContent={t('stake|withdrawalFeeTooltip')}
        className={CardCellClassName}
      >
        <StatePercentage isLoading={false} value="2" />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stake|Interface Fee')}
        tooltipContent={t('stake|interfaceFeeTooltip')}
        className={CardCellClassName}
      >
        <StatePercentage isLoading={false} value="2" />
      </DetailsCardCell>

      <div className={cx(s.detailsButtons, styles.stakeDetailsButtons)}>
        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={item?.depositTokenUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Token Contract')}
        </Button>

        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={item?.stakeUrl ?? `${TZKT_EXPLORER_URL}/${STAKING_CONTRACT_ADDRESS}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Staking Contract')}
        </Button>
      </div>
    </Card>
  );
};
