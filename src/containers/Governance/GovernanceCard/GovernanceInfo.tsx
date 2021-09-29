import React, {
  useContext, useState, useMemo,
} from 'react';
import cx from 'classnames';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

import { GovernanceCardProps, ProposalType } from '@utils/types';
import { useGovernanceContract } from '@utils/dapp';
import { getUniqueKey } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useGovernance } from '@hooks/useGovernance';
import { useProposalDescription } from '@hooks/useProposalDescription';
import { useProposalVotes } from '@hooks/useProposalVotes';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';
import { Markdown } from '@components/ui/Markdown';
import { CardCell } from '@components/ui/Card/CardCell';
import { VoteCell } from '@components/ui/Modal/ModalCell/VoteCell';
import { VoteModal } from '@components/modals/VoteModal';
import { Back } from '@components/svg/Back';
import { ExternalLink } from '@components/svg/ExternalLink';
import { Skeleton } from '@components/ui/Skeleton';

import s from './GovernanceCard.module.sass';
import { GovernanceDetails } from './GovernanceDetails';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const GovernanceInfo: React.FC<GovernanceCardProps & {
  proposal: ProposalType,
  isFor: boolean,
  isAgainst: boolean
}> = ({
  name,
  workDates,
  status = 'pending',
  description,
  voted,
  votes,
  currency,
  className,
  author,
  ipfsLink,
  reject,
  participants,
  proposal,
  isAgainst,
  isFor,
  support,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['governance']);
  const { totalSupply } = useGovernance();
  const governanceContract = useGovernanceContract();

  const { loadedDescription, isLoaded } = useProposalDescription(description);
  const [voteModal, setVoteModal] = useState<boolean>(false);
  const { loadedVotes: votesData, isLoaded: isLoadedVotes } = useProposalVotes(`${proposal.id}`);

  const quorum = useMemo(() => (governanceContract && totalSupply
    ? proposal.config.votingQuorum
      .dividedBy(governanceContract.accuracy)
      .multipliedBy(totalSupply)
      .toString()
    : '—.—'), [governanceContract, totalSupply]);

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.fullWidth,
    s.mb24i,
    s.govBody,
    className,
  );
  return (
    <>
      <VoteModal
        isOpen={voteModal}
        onRequestClose={() => setVoteModal(false)}
        onChange={() => setVoteModal(false)}
      />
      <Card
        className={compountClassName}
      >
        <CardHeader
          header={{
            content: (
              <Button
                href="/governance"
                theme="quaternary"
                className={s.proposalButton}
                control={
                  <Back className={s.proposalBackIcon} />
                }
              >
                {t('governance|Back')}
              </Button>
            ),
          }}
          className={s.cardHeader}
        />
        <CardHeader
          header={{
            content: (
              <div className={s.govHeader}>
                <div className={s.govName}>
                  {name}
                </div>
                <div className={s.govGroup}>
                  <div className={s.govDates}>
                    <span>{moment(workDates[0]).format('DD MMM YYYY')}</span>
                    <span> - </span>
                    <span>{moment(workDates[1]).format('DD MMM YYYY')}</span>
                  </div>
                  <Bage
                    className={s.govBage}
                    text={status}
                    variant={status === 'pending' || status === 'underrated' || status === 'rejected' ? 'inverse' : 'primary'}
                  />

                </div>
              </div>
            ),
            button: (
              <Button onClick={() => setVoteModal(true)} className={s.govButton}>
                {t('governance|Vote')}
              </Button>

            ),
          }}
          className={s.proposalSubHeader}
        />
        <div className={cx(s.mobile, s.button)}>
          <Button onClick={() => setVoteModal(true)} className={s.govButtonBottom}>
            {t('governance|Vote')}
          </Button>
        </div>
        <div className={s.mobile}>
          <GovernanceDetails
            workDates={workDates}
            voted={voted}
            votes={votes}
            currency={currency}
            author={author}
            ipfsLink={ipfsLink}
            status={status}
            reject={reject}
            participants={participants}
            quorum={quorum}
            isFor={isFor}
            isAgainst={isAgainst}
            support={support}
          />
        </div>
        <CardContent className={s.govContent}>
          <div className={s.govDescription}>
            {!isLoaded
              ? <Skeleton className={cx(s.govDescription, s.govDescriptionSkeleton)} />
              : <Markdown markdown={loadedDescription} />}
          </div>
          <Button onClick={() => setVoteModal(true)} className={s.govButtonBottom}>
            {t('governance|Vote')}
          </Button>
        </CardContent>
      </Card>
      <div className={cx(modeClass[colorThemeMode], s.proposalSidebar)}>
        <div className={s.sticky}>
          <Card className={cx(s.desktop, s.proposalDetails)}>
            <GovernanceDetails
              workDates={workDates}
              voted={voted}
              votes={votes}
              currency={currency}
              author={author}
              ipfsLink={ipfsLink}
              status={status}
              reject={reject}
              participants={participants}
              quorum={quorum}
              isFor={isFor}
              isAgainst={isAgainst}
              support={support}
            />
          </Card>
          <Card className={s.proposalDetails}>
            <CardHeader header={{
              content: (<h5>{t('governance|Votes')}</h5>),
            }}
            />
            <CardContent className={s.proposalVotes}>
              {isLoadedVotes
                ? votesData.map((x) => (
                  <VoteCell
                    key={x.id}
                    value={voted}
                    vote={x}
                    currency={currency}
                  />
                ))
                : <Skeleton className={cx(s.govDescription, s.govDetailsSkeleton)} />}
            </CardContent>
          </Card>
          <Card className={s.proposalDetails}>
            <CardHeader header={{
              content: (<h5>{t('governance|References')}</h5>),
            }}
            />
            <CardContent className={s.content}>
              <CardCell
                className={s.linkCell}
                header={(
                  <Button
                    className={s.detailsButton}
                    theme="inverse"
                    icon={
                      <ExternalLink id={`${getUniqueKey()}`} className={s.linkIcon} />
                    }
                  >
                    {t('governance|The proposal on forum')}
                  </Button>
             )}
              />
              <CardCell
                className={s.linkCell}
                header={(
                  <Button
                    className={s.detailsButton}
                    theme="inverse"
                    icon={
                      <ExternalLink id={`${getUniqueKey()}`} className={s.linkIcon} />
                    }
                    href={description}
                  >
                    {t('governance|The QIP on Github')}
                  </Button>
              )}
              />
              <CardCell
                className={s.linkCell}
                header={(
                  <Button
                    className={s.detailsButton}
                    theme="inverse"
                    icon={
                      <ExternalLink id={`${getUniqueKey()}`} className={s.linkIcon} />
                    }
                    href="/"
                  >
                    {t('governance|Governance FAQs')}
                  </Button>
              )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
