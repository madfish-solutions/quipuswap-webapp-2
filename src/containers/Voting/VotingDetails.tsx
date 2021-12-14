import React, { useMemo } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Card, Button, Tooltip, CardCell, ExternalLink, CurrencyAmount } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { FormatNumber } from '@utils/helpers/formatNumber';
import { Undefined, VoterType, WhitelistedBaker, WhitelistedTokenPair } from '@utils/types';

import { CandidateButton } from './CandidateButton';
import { getCandidateInfo, getVeteVetoInfo } from './helpers/getBackerInfo';

type VotingDetailsProps = {
  tokenPair: WhitelistedTokenPair;
  dex?: FoundDex;
  voter?: VoterType;
};

export const VotingDetails: React.FC<VotingDetailsProps> = ({ tokenPair, dex, voter }) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();

  const { currentCandidate, secondCandidate } = useMemo(() => getCandidateInfo(dex, bakers), [dex, bakers]);

  const myCandidate: Undefined<WhitelistedBaker> = bakers.find(backer => backer.address === voter?.candidate);

  const { totalVotes, totalVeto, votesToVeto } = useMemo(() => getVeteVetoInfo(dex), [dex]);

  const pairLink = tokenPair.dex && `https://analytics.quipuswap.com/pairs/${tokenPair.dex?.contract.address}`;

  return (
    <Card
      header={{
        content: 'Voting Details'
      }}
      contentClassName={s.content}
    >
      <CardCell
        header={
          <>
            {t('vote|Delegated To')}
            <Tooltip sizeT="small" content={t('vote|Current baker elected by simple majority of votes.')} />
          </>
        }
        className={cx(s.cellCenter, s.cell)}
      >
        <CandidateButton candidate={currentCandidate} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('vote|Second Candidate')}
            <Tooltip
              sizeT="small"
              content={t(
                'vote|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.'
              )}
            />
          </>
        }
        className={cx(s.cellCenter, s.cell)}
      >
        <CandidateButton candidate={secondCandidate} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('vote|Total Votes')}
            <Tooltip sizeT="small" content={t('vote|The total amount of votes cast to elect a baker in the pool.')} />
          </>
        }
        className={cx(s.cellCenter, s.cell)}
      >
        <CurrencyAmount amount={FormatNumber(totalVotes)} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('vote|Total Vetos')}
            <Tooltip
              sizeT="small"
              content={t('vote|The total amount of shares cast so far to veto the current baker.')}
            />
          </>
        }
        className={cx(s.cellCenter, s.cell)}
      >
        <CurrencyAmount amount={FormatNumber(totalVeto)} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('vote|Your Candidate')}
            <Tooltip sizeT="small" content={t('vote|The candidate you voted for.')} />
          </>
        }
        className={cx(s.cellCenter, s.cell)}
      >
        <CandidateButton candidate={myCandidate} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('Votes To Veto Left')}
            <Tooltip sizeT="small" content={t('vote|This much more votes needed to veto a delegate.')} />
          </>
        }
        className={cx(s.cellCenter, s.cell)}
      >
        <CurrencyAmount amount={FormatNumber(votesToVeto)} />
      </CardCell>
      {tokenPair.dex && (
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={pairLink}
            external
            icon={<ExternalLink className={s.linkIcon} />}
          >
            {t('vote|Pair Analytics')}
          </Button>
        </div>
      )}
    </Card>
  );
};
