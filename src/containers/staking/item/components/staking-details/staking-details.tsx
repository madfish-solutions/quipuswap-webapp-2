import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { IS_NETWORK_MAINNET, MS_IN_SECOND, STAKING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@app.config';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import { StakingItem } from '@interfaces/staking.interfaces';
import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { bigNumberToString, getDollarEquivalent } from '@utils/helpers';
import { Optional } from '@utils/types';

import { getDepositTokenSymbol } from '../../helpers';
import { Countdown } from '../countdown';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './staking-details.module.sass';

const endTimestamp = Date.now() + 90069 * MS_IN_SECOND;
const dailyDistribution = new BigNumber(1000);

interface Props {
  item: Optional<StakingItem>;
  isError: boolean;
}

export const StakingDetails: FC<Props> = ({ item, isError }) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  const depositTokenSymbol = item && getDepositTokenSymbol(item);
  const depositTokenDecimals = item?.tokenB ? 6 : item?.tokenA.metadata.decimals ?? 0;
  const tvlDollarEquivalent = item && IS_NETWORK_MAINNET ? item.tvl.toFixed() : null;
  const tokensTvl = item?.depositExchangeRate.gt(0)
    ? item.tvl.dividedBy(item.depositExchangeRate).decimalPlaces(depositTokenDecimals)
    : null;
  const distributionDollarEquivalent =
    item && IS_NETWORK_MAINNET
      ? getDollarEquivalent(bigNumberToString(dailyDistribution), bigNumberToString(item.earnExchangeRate))
      : null;

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
          currency={depositTokenSymbol}
          amount={tokensTvl}
          amountDecimals={depositTokenDecimals}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Daily Distribution')} tooltipContent={null} className={CardCellClassName}>
        <StateCurrencyAmount
          balanceRule
          dollarEquivalent={distributionDollarEquivalent}
          currency={item?.rewardToken.metadata.symbol}
          amount={dailyDistribution.toFixed()}
          amountDecimals={item?.rewardToken.metadata.decimals}
          isError={isError}
        />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|APR')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage value={item?.apr?.toFixed() ?? null} isLoading={!isError && !item} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|dailyApr')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={!isError && !item} value={item?.apr?.dividedBy(365).toFixed() ?? null} />
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
