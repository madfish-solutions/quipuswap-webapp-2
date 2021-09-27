import { useRouter } from 'next/router';
import React, {
  useContext, useState, useEffect, useMemo,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useGovernance } from '@hooks/useGovernance';
import { STABLE_TOKEN } from '@utils/defaults';
import { transformProposalToGovernanceProps } from '@utils/helpers';
import {
  GovernanceCard, GovernanceInfo,
} from '@containers/Governance/GovernanceCard';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { StickyBlock } from '@components/common/StickyBlock';

import { useUsersVotes } from '@hooks/useUsersVotes';
import s from './Governance.module.sass';
import { GovernanceInfoSkeleton } from './GovernanceCard/GovernanceInfoSkeleton';
import { GovernanceCardLoader } from './GovernanceCard/GovernanceCardLoader';

const PieChart = dynamic(() => import('@components/ui/PieChart'), {
  ssr: false,
});

const PROPOSAL_STATUSES = [
  {
    id: 'pending',
    label: 'Pending',
  },
  {
    id: 'banned',
    label: 'Banned',
  },
  {
    id: 'approved',
    label: 'Approved',
  },
  {
    id: 'activated',
    label: 'Activated',
  },
  {
    id: 'rejected',
    label: 'Rejected',
  },
  {
    id: 'underrated',
    label: 'Underrated',
  },
  {
    id: 'voting',
    label: 'Voting',
  },
];

const TabsContent = [
  {
    id: 'all',
    label: 'All',
  }, ...PROPOSAL_STATUSES.map((x) => ({ id: x.id, label: x.label })),
];

const TOP_COLORS = ['#1373E4', '#2ED33E', '#F9A605', '#EA2424'];

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type GovernanceProps = {
  className?: string
};

export const Governance: React.FC<GovernanceProps> = ({
  className,
}) => {
  const { t } = useTranslation(['governance']);
  const router = useRouter();
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const [proposal, selectProposal] = useState<string>('');
  const { colorThemeMode } = useContext(ColorThemeContext);
  const userVotes = useUsersVotes();
  const { data: proposals, loaded: proposalsLoaded } = useGovernance();

  const handleUnselect = () => selectProposal('');

  console.log(userVotes, proposals, proposalsLoaded);

  useEffect(() => {
    if (router.query.status
      && router.query.status !== tabsState
      && TabsContent.some((tab) => tab.id === router.query.status)) {
      setTabsState(router.query.status.toString());
    }
  }, [router.query]);

  useEffect(() => {
    if (router.query.proposal && proposalsLoaded) {
      const proposalObj = proposals.find((x) => `${x.id}` === router.query.proposal);
      if (proposalObj) {
        selectProposal(`${proposalObj.id}`);
      }
    }
  }, [router.query, proposals, proposalsLoaded]);

  const totalVetos = useMemo(() => proposals
    .reduce((prev, cur) => cur.votesAgainst.plus(prev), new BigNumber(0)), [proposals]);
  // const totalVotes = useMemo(() => proposals
  //   .reduce((prev, cur) => cur.votesFor.plus(prev), new BigNumber(0)), [proposals]);
  // const totalBalance = useMemo(() => proposals
  //   .reduce((prev, cur) => cur.votesFor.plus(prev), new BigNumber(0)), [proposals]);
  // const totalClaim = useMemo(() => proposals
  //   .reduce((prev, cur) => cur.votesFor.plus(prev), new BigNumber(0)), [proposals]);

  const proposalObj = proposals.find((x) => `${x.id}` === proposal);

  const renderProposals = useMemo(() => proposals
    .filter((x) => tabsState === 'all' || x.status === tabsState)
    .map(transformProposalToGovernanceProps), [proposals, tabsState]);

  if (router.query.proposal && !proposalsLoaded) {
    return (
      <div className={cx(className, s.proposal)}>
        <GovernanceInfoSkeleton />
      </div>
    );
  }

  if (proposal && proposalObj) {
    return (
      <div className={cx(className, s.proposal)}>
        <GovernanceInfo
          {...(transformProposalToGovernanceProps(proposalObj))}
          handleUnselect={handleUnselect}
        />
      </div>
    );
  }

  const statusesOfProposals = proposals
    .reduce(
      (prev, cur) => ({ ...prev, [cur.status]: prev[cur.status] + 1 }), Object
        .fromEntries(PROPOSAL_STATUSES.map((x) => [x.id, 0])),
    );
  const reducedChartData = Object.keys(statusesOfProposals)
    .map((x) => ({ key: x, value: statusesOfProposals[x] })) // gather array of summ equal statuses
    .sort((b, a) => a.value - b.value) // sort by count DESC
    .reduce((prev:any, cur, i) => (
      i < 4
        ? [...prev, { label: cur.key, value: cur.value, color: TOP_COLORS[i] }]
        : [...prev.slice(0, 4), { label: 'Other', value: prev[4] ? prev[4].value + cur.value : cur.value, color: '#8B90A0' }]
    ), []); // element > 5 to element#4 and label 'Other'

  return (
    <>
      <Card
        className={cx(className, themeClass[colorThemeMode])}
      >
        <CardContent className={s.container}>
          <PieChart
            data={reducedChartData}
            legend
            label="Proposals summary"
            showTotal
            className={s.chart}
          />
          <div className={s.voteInfo}>
            <div className={s.deviceRow}>
              <div className={s.voteRow}>
                <div className={s.voteCat}>
                  {t('governance|Total vetoed {{token}}', { token: STABLE_TOKEN.metadata.symbol })}
                  :
                </div>
                <div className={s.voteNum}>{totalVetos.toString()}</div>
              </div>
              <div className={s.voteRow}>
                <div className={s.voteCat}>
                  {t('governance|Your {{token}} balance', { token: STABLE_TOKEN.metadata.symbol })}
                  :
                </div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
              <div className={s.voteRow}>
                <div className={s.voteCat}>
                  {t('governance|Your Voted {{token}}', { token: STABLE_TOKEN.metadata.symbol })}
                  :
                </div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
              <div className={s.voteRow}>
                <div className={s.voteCat}>
                  {t('governance|Total Claimable {{token}}', { token: STABLE_TOKEN.metadata.symbol })}
                  :
                </div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
            </div>
            <div className={s.voteButtons}>
              <Button
                href="/governance-submit"
                theme="secondary"
                className={s.voteButton}
              >
                {t('governance|Submit proposal')}
              </Button>
              <Button className={s.voteButton}>
                {t('governance|Claim unlocked')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <StickyBlock className={cx(className, s.unsticky)}>
        <div className={cx(s.governTabs)}>
          <div className={cx(s.govCard)}>
            <Card
              className={cx(s.govCardInner)}
            >
              <CardContent className={s.tabContent}>
                <Tabs
                  values={TabsContent}
                  activeId={tabsState}
                  setActiveId={(val) => {
                    setTabsState(val);
                    router.replace(`/governance?status=${val}`, undefined, { shallow: true });
                  }}
                  className={s.govTabs}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {renderProposals.length < 1 ? (
          <>
            <GovernanceCardLoader />
            <GovernanceCardLoader />
            <GovernanceCardLoader />
          </>
        )
          : renderProposals.map((x) => (
            <GovernanceCard
              key={x.id}
              {...x}
              href={`/governance/${x.id}`}
            />
          ))}

      </StickyBlock>
    </>
  );
};
