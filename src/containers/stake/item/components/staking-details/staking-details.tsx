import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { MS_IN_SECOND, STAKING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@app.config';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { getDollarEquivalent } from '@containers/stake/list/helpers';
import { CandidateButton } from '@containers/voiting/components';
import { StakeItem } from '@interfaces/staking';
import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { bigNumberToString } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { Countdown } from '../countdown';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './staking-details.module.sass';

const endTimestamp = Date.now() + 90069 * MS_IN_SECOND;

interface Props {
  data: Nullable<StakeItem>;
  isError: boolean;
}

export const StakingDetails: FC<Props> = ({ data, isError }) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);
  const tvlDollarEquivalent =
    data && getDollarEquivalent(bigNumberToString(data.tvl), bigNumberToString(data.depositExchangeRate));
  const distributionDollarEquivalent =
    data && getDollarEquivalent(bigNumberToString(new BigNumber(1000)), bigNumberToString(data.earnExchangeRate));

  return (
    <Card
      header={{
        content: t('stake|Stake Details')
      }}
      contentClassName={s.content}
    >
      <DetailsCardCell cellName={t('stake|Value Locked')} className={CardCellClassName} tooltipContent={null}>
        <StateCurrencyAmount
          dollarEquivalent={tvlDollarEquivalent}
          currency={data?.tokenB ? 'TOKEN' : data?.tokenA.metadata.symbol}
          amount={data?.tvl ?? null}
          amountDecimals={data?.tokenB ? 6 : data?.tokenA.metadata.decimals}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Daily Distribution')} tooltipContent={null} className={CardCellClassName}>
        <StateCurrencyAmount
          dollarEquivalent={distributionDollarEquivalent}
          currency={data?.rewardToken.metadata.symbol}
          amount="1000"
          amountDecimals={data?.rewardToken.metadata.decimals}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|APR')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage value={data?.apr?.toFixed() ?? null} isLoading={!isError && !data} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|dailyApr')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={!isError && !data} value={data?.apr?.dividedBy(365).toFixed() ?? null} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Current Delegate')} tooltipContent={null} className={CardCellClassName}>
        <CandidateButton candidate={bakers[0]} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Next Delegate')} tooltipContent={null} className={CardCellClassName}>
        <CandidateButton candidate={bakers[1]} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|stakingEndsIn')} tooltipContent={null} className={CardCellClassName}>
        <Countdown endTimestamp={endTimestamp} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Lock Period')} tooltipContent={null} className={CardCellClassName}>
        <TimespanView value={86400 * MS_IN_SECOND} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Withdrawal Fee')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={false} value="2" />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Interface Fee')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={false} value="2" />
      </DetailsCardCell>

      <div className={cx(s.detailsButtons, styles.stakeDetailsButtons)}>
        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={data?.depositTokenUrl}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Token Contract')}
        </Button>

        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={data?.stakeUrl ?? `${TZKT_EXPLORER_URL}/${STAKING_CONTRACT_ADDRESS}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Staking Contract')}
        </Button>
      </div>
    </Card>
  );
};
