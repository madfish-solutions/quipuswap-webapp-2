import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { MS_IN_SECOND, STAKING_CONTRACT_ADDRESS, TZKT_EXPLORER_URL } from '@app.config';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { isNull } from '@utils/helpers';

import { Countdown } from '../countdown';
import { StatePercentage } from '../state-percentage';
import { TimespanView } from '../timespan-view';
import styles from './staking-details.module.sass';

const tokenContractAddress = 'KT1CaWSNEnU6RR9ZMSSgD5tQtQDqdpw4sG83';

const endTimestamp = Date.now() + 90069 * MS_IN_SECOND;

export const StakingDetails: FC = () => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertical);

  return (
    <Card
      header={{
        content: t('stake|Stake Details')
      }}
      contentClassName={s.content}
    >
      <DetailsCardCell cellName={t('stake|Value Locked')} className={CardCellClassName} tooltipContent={null}>
        <StateCurrencyAmount dollarEquivalent="1.01" currency="TOKEN" amount="1000000" amountDecimals={2} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|Daily Distribution')} tooltipContent={null} className={CardCellClassName}>
        <StateCurrencyAmount dollarEquivalent="1.01" currency="TOKEN" amount="1000" amountDecimals={2} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|APR')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={false} value="888" />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('stake|dailyApr')} tooltipContent={null} className={CardCellClassName}>
        <StatePercentage isLoading={false} value="0.008" />
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
          href={isNull(tokenContractAddress) ? undefined : `${TZKT_EXPLORER_URL}/${tokenContractAddress}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Token Contract')}
        </Button>

        <Button
          className={cx(s.detailsButton, styles.stakeDetailsButton)}
          theme="inverse"
          href={STAKING_CONTRACT_ADDRESS ? `${TZKT_EXPLORER_URL}/${STAKING_CONTRACT_ADDRESS}` : undefined}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('stake|Staking Contract')}
        </Button>
      </div>
    </Card>
  );
};
