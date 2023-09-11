import { FC } from 'react';

import cx from 'classnames';

import { HIDE_ANALYTICS, QUIPUSWAP_ANALYTICS_PAIRS } from '@config/config';
import { eQuipuSwapVideo } from '@config/youtube';
import { useTokensPair, useVoter, useVotingDex, useVotingLoading } from '@modules/voting/helpers/voting.provider';
import { useBakers } from '@providers/dapp-bakers';
import {
  DetailsCardCell,
  StateCurrencyAmount,
  CandidateButton,
  Card,
  Tabs,
  YouTube,
  Iterator
} from '@shared/components';
import { Button } from '@shared/components/button';
import { isNull } from '@shared/helpers';
import { useYoutubeTabs } from '@shared/hooks';
import { ExternalLink } from '@shared/svg';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './voting-details.module.scss';
import { getCandidateInfo, getVotingInfo } from '../../helpers';

export const VotingDetails: FC = () => {
  const { t } = useTranslation();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('voting|Voting Details'),
    page: t('common|Voting')
  });
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
        content: <Tabs tabs={tabsContent} activeId={activeId} setActiveId={setTabId} className={s.tabs} />,
        className: s.header
      }}
      contentClassName={s.content}
      data-test-id="votingDetails"
    >
      {isDetails ? (
        <>
          <DetailsCardCell
            cellName={t('voting|Delegated To')}
            tooltipContent={t('voting|Current baker elected by simple majority of votes.')}
            className={CardCellClassName}
            data-test-id="delegatedTo"
          >
            <CandidateButton candidate={wrapCurrentCandidate} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('voting|Second Candidate')}
            tooltipContent={t(
              'voting|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.'
            )}
            className={CardCellClassName}
            data-test-id="secondCandidate"
          >
            <CandidateButton candidate={wrapSecondCandidate} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('voting|Total Votes')}
            tooltipContent={t('voting|The total amount of votes cast to elect a baker in the pool.')}
            className={CardCellClassName}
            data-test-id="totalVotes"
          >
            <StateCurrencyAmount amount={totalVotesAmount} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('voting|Total Vetos')}
            tooltipContent={t('voting|The total amount of shares cast so far to veto the current baker.')}
            className={CardCellClassName}
            data-test-id="totalVetos"
          >
            <StateCurrencyAmount amount={totalVetoAmount} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('voting|Your Candidate')}
            tooltipContent={t('voting|The candidate you voted for.')}
            className={CardCellClassName}
            data-test-id="yourCandidate"
          >
            <CandidateButton candidate={wrapMyCandidate} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('voting|Votes To Veto Left')}
            tooltipContent={t('voting|This much more votes needed to veto a delegate.')}
            className={CardCellClassName}
            data-test-id="votesToVetoLeft"
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
                data-test-id="pairAnalytics"
              >
                {t('voting|Pair Analytics')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Iterator
          isGrouped
          wrapperClassName={s.youtubeList}
          render={YouTube}
          data={[
            { video: eQuipuSwapVideo.HowToVoteForTheLPBaker },
            { video: eQuipuSwapVideo.HowToCollectRewardsForBaking }
          ]}
        />
      )}
    </Card>
  );
};
