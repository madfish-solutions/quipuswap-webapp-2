import React from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Button, Card, ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { QUIPUSWAP_ANALYTICS_PAIRS } from '@app.config';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { CandidateButton } from '@containers/voiting/components';
import s from '@styles/CommonContainer.module.sass';
import { useBakers } from '@utils/dapp';
import { VoterType, WhitelistedTokenPair } from '@utils/types';

import { getCandidateInfo, getVeteVetoInfo } from '../../../Voting/helpers/getBackerInfo';
import styles from './voting-details.module.scss';

interface VotingDetailsProps {
  tokenPair: WhitelistedTokenPair;
  dex?: FoundDex;
  voter?: VoterType;
}

export const VotingDetails: React.FC<VotingDetailsProps> = ({ tokenPair, dex, voter }) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();

  const { currentCandidate, secondCandidate } = getCandidateInfo(dex, bakers);
  const myCandidate = bakers.find(backer => backer.address === voter?.candidate);

  const { totalVotes, totalVeto, votesToVeto } = getVeteVetoInfo(dex);

  const pairLink = tokenPair.dex && `${QUIPUSWAP_ANALYTICS_PAIRS}/${tokenPair.dex.contract.address}`;

  const CardCellClassName = cx(s.cellCenter, s.cell, styles.vertialCenter);

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
        <CandidateButton candidate={currentCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Second Candidate')}
        tooltipContent={t(
          'vote|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.'
        )}
        className={CardCellClassName}
      >
        <CandidateButton candidate={secondCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Total Votes')}
        tooltipContent={t('vote|The total amount of votes cast to elect a baker in the pool.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={totalVotes} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Total Vetos')}
        tooltipContent={t('vote|The total amount of shares cast so far to veto the current baker.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={totalVeto} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('vote|Your Candidate')}
        tooltipContent={t('vote|The candidate you voted for.')}
        className={CardCellClassName}
      >
        <CandidateButton candidate={myCandidate} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('Votes To Veto Left')}
        tooltipContent={t('vote|This much more votes needed to veto a delegate.')}
        className={CardCellClassName}
      >
        <StateCurrencyAmount amount={votesToVeto} />
      </DetailsCardCell>

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
