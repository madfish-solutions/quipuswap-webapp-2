import React from 'react';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

import { getUniqueKey, shortize } from '@utils/helpers';
import { ProposalStatus } from '@utils/types';
import { CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import DonutChart from '@components/ui/DonutChart';
import { ExternalLink } from '@components/svg/ExternalLink';
import For from '@icons/For.svg';
import NotFor from '@icons/NotFor.svg';

import s from './GovernanceCard.module.sass';

export type GovernanceDetailsProps = {
  workDates: Date[]
  status: ProposalStatus
  voted: string
  support: string
  votes: string
  currency: string
  author:string
  ipfsLink: string
  reject: string,
  participants: string,
  quorum: string,
  isAgainst: boolean,
  isFor: boolean,
  className?: string
};

export const GovernanceDetails: React.FC<GovernanceDetailsProps> = ({
  workDates,
  voted,
  support,
  votes,
  currency,
  author,
  reject,
  participants,
  quorum,
  ipfsLink,
  isFor,
  isAgainst,
}) => {
  const { t } = useTranslation(['common', 'governance']);

  return (
    <>
      <CardHeader header={{
        content: <h5>{t('governance|Details')}</h5>,
      }}
      />
      <CardContent className={s.detailsContent}>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|IPFS')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            <Button
              theme="inverse"
              icon={
                <ExternalLink id={`${getUniqueKey()}`} className={s.linkIcon} />
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
          header={t('governance|Start Date')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            {moment(workDates[0]).format('DD MMM YYYY')}
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|End Date')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            {moment(workDates[1]).format('DD MMM YYYY')}
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|Author')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            <Button
              className={s.detailsButton}
              icon={
                <ExternalLink id={`${getUniqueKey()}`} className={s.linkIcon} />
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
          header={t('governance|Participants')}
          className={s.cell}
        >
          <div className={s.cellDate}>
            <CurrencyAmount amount={participants} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|Quorum')}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount={quorum} currency={currency} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|Total Votes')}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount={voted} currency={currency} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|Your Votes')}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount={votes} currency={currency} />
          </div>
        </CardCell>
        <CardCell
          headerClassName={s.cellHeader}
          header={t('governance|Option')}
          className={s.cell}
        >
          {isFor && (
          <div className={s.cellDate}>
            {t('governance|For')}
            {' '}
            <For className={s.voteIcon} />
          </div>
          )}
          {isAgainst && (
          <div className={s.cellDate}>
            {t('governance|Against')}
            {' '}
            <NotFor className={s.voteIcon} />
          </div>
          )}
        </CardCell>
        <DonutChart
          className={s.donut}
          votes={+support}
          vetos={+reject}
        />
      </CardContent>
    </>
  );
};
