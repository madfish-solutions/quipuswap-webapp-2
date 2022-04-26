import { FC } from 'react';

import cx from 'classnames';

import { HIDE_ANALYTICS, QUIPUSWAP_ANALYTICS_PAIRS } from '@config/config';
import { useTokensPair, useVoter, useVotingDex, useVotingLoading } from '@modules/voting/helpers/voting.provider';
import { useBakers } from '@providers/dapp-bakers';
import { DetailsCardCell, StateCurrencyAmount, CandidateButton, Card } from '@shared/components';
import { Button } from '@shared/components/button';
import { isNull } from '@shared/helpers';
import { ExternalLink } from '@shared/svg';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { getCandidateInfo, getVotingInfo } from '../../helpers';
import styles from './voting-details.module.scss';

export const VotingDetails: FC = () => {
  const { t } = useTranslation();
  const { data: bakers } = useBakers();
  const { candidate } = useVoter();
  const { tokenPair } = useTokensPair();
  const { dex } = useVotingDex();

  const { isVotingLoading } = useVotingLoading();

  const { currentCandidate, secondCandidate } = getCandidateInfo(dex, bakers);
  const myCandidate = bakers.find(baker => baker.address === candidate) ?? null;

  const { totalVotes, totalVeto, votesToVeto } = getVotingInfo(dex);

  const pairLink = tokenPair?.dex && `${QUIPUSWAP_ANALYTICS_PAIRS}/${tokenPair.dex.contract.address}`;

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertialCenter);

  const isVotingLoaded = !isVotingLoading;

  const wrapCurrentCandidate = isVotingLoaded ? currentCandidate : null;
  const wrapSecondCandidate = isVotingLoaded ? secondCandidate : null;
  const wrapMyCandidate = isVotingLoaded ? myCandidate : null;

  const totalVotesAmount = isVotingLoaded ? totalVotes : null;
  const totalVetoAmount = isVotingLoaded ? totalVeto : null;
  const votesToVetoAmount = isVotingLoaded ? votesToVeto : null;

  return (
    <Card
      header={{
        content: t('voting|Voting Details')
      }}
      contentClassName={s.content}
      data-test-id="votingDetails"
    >
      <DetailsCardCell
        cellName={t('voting|Delegated To')}
        tooltipContent={t('voting|Current baker elected by simple majority of votes.')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={wrapCurrentCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('voting|Second Candidate')}
        tooltipContent={t(
          'voting|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.'
        )}
        className={CardCellClassName}
      >
        <CandidateButton candidate={wrapSecondCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('voting|Total Votes')}
        tooltipContent={t('voting|The total amount of votes cast to elect a baker in the pool.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={totalVotesAmount} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('voting|Total Vetos')}
        tooltipContent={t('voting|The total amount of shares cast so far to veto the current baker.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={totalVetoAmount} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('voting|Your Candidate')}
        tooltipContent={t('voting|The candidate you voted for.')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={wrapMyCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('voting|Votes To Veto Left')}
        tooltipContent={t('voting|This much more votes needed to veto a delegate.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={votesToVetoAmount} />
      </DetailsCardCell>

      {!HIDE_ANALYTICS && tokenPair?.dex && (
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={isNull(pairLink) ? undefined : pairLink}
            external
            icon={<ExternalLink className={s.linkIcon} />}
          >
            {t('voting|Pair Analytics')}
          </Button>
        </div>
      )}
    </Card>
  );
};
