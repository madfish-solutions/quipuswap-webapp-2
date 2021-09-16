import React from 'react';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

import { shortize } from '@utils/helpers';
import { CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import DonutChart from '@components/ui/DonutChart';
import { ExternalLink } from '@components/svg/ExternalLink';
import For from '@icons/For.svg';

import s from './GovernanceCard.module.sass';

export type GovernanceDetailsProps = {
  workDates: Date[]
  status: 'PENDING' | 'ON-GOING' | 'APPROVED' | 'ACTIVATED' | 'FAILED'
  voted: string
  votes: string
  currency: string
  author:string
  ipfsLink: string
  className?: string
};

export const GovernanceDetails: React.FC<GovernanceDetailsProps> = ({
  workDates,
  voted,
  votes,
  currency,
  author,
  ipfsLink,
}) => {
  const { t } = useTranslation(['common', 'governance']);

  const totalVotes = 155000;
  const totalVetos = 120000;

  return (
    <>
      <CardHeader header={{
        content: <h5>Details</h5>,
      }}
      />
      <CardContent className={s.detailsContent}>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:IPFS')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            <Button
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
                    }
              className={s.detailsButton}
              external
              href={ipfsLink}
            >
              {shortize(ipfsLink, 20)}
            </Button>
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Start Date')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            {moment(workDates[0]).format('DD MMM YYYY')}
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:End Date')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            {moment(workDates[1]).format('DD MMM YYYY')}
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Author')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            <Button
              className={s.detailsButton}
              icon={
                <ExternalLink className={s.linkIcon} />
                    }
              external
              href={`https://tzkt.io/${author}`}
              theme="inverse"
            >
              {shortize(author)}
            </Button>
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Participants')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            <CurrencyAmount amount="1000000" />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Quorum')}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1000000" currency={currency} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Total Votes')}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount={voted} currency={currency} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Your Votes')}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount={votes} currency={currency} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance:Option')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            For
            {' '}
            <For className={s.voteIcon} />
          </div>
        </CardCell>
        <DonutChart
          className={s.donut}
          votes={totalVotes}
          vetos={totalVetos}
        />
      </CardContent>
    </>
  );
};
