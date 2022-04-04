import { FC } from 'react';

import { Card, ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { HIDE_ANALYTICS, QUIPUSWAP_ANALYTICS_PAIRS } from '@app.config';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import { useTokensPair, useVoter, useVotingDex, useVotingLoading } from '@containers/voiting/helpers/voting.provider';
import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { isNull } from '@utils/helpers';

import { getCandidateInfo, getVotingInfo } from '../../helpers';
import styles from './voting-details.module.scss';

export const VotingDetails: FC = () => {
  const { t } = useTranslation(['common', 'vote']);
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
        content: 'Voting Details'
      }}
      contentClassName={s.content}
    >
      <DetailsCardCell
        cellName={t('vote|Delegated To')}
        tooltipContent={t('vote|Current baker elected by simple majority of votes.')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={wrapCurrentCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Second Candidate')}
        tooltipContent={t(
          'vote|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.'
        )}
        className={CardCellClassName}
      >
        <CandidateButton candidate={wrapSecondCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Total Votes')}
        tooltipContent={t('vote|The total amount of votes cast to elect a baker in the pool.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={totalVotesAmount} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Total Vetos')}
        tooltipContent={t('vote|The total amount of shares cast so far to veto the current baker.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={totalVetoAmount} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Your Candidate')}
        tooltipContent={t('vote|The candidate you voted for.')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={wrapMyCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('Votes To Veto Left')}
        tooltipContent={t('vote|This much more votes needed to veto a delegate.')}
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
            {t('vote|Pair Analytics')}
          </Button>
        </div>
      )}
    </Card>
  );
};
