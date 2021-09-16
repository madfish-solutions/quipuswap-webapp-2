import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getStorageInfo, useNetwork, useTezos } from '@utils/dapp';
import { GOVERNANCE_CONTRACT } from '@utils/defaults';
import { GovernanceStorageInfo, ProposalType } from '@utils/types';
import { prepareIpfsLink, transformProposalToGovernanceProps } from '@utils/helpers';
import {
  GovernanceCard, GovernanceInfo,
} from '@containers/Governance/GovernanceCard';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { StickyBlock } from '@components/common/StickyBlock';

import s from '@styles/CommonContainer.module.sass';
import { GovernanceInfoSkeleton } from './GovernanceCard/GovernanceInfoSkeleton';

const PieChart = dynamic(() => import('@components/ui/PieChart'), {
  ssr: false,
});

const TabsContent = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'pending',
    label: 'Pending',
  },
  {
    id: 'ongoing',
    label: 'On-going',
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
    id: 'failed',
    label: 'Failed',
  },
];

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type GovernanceProps = {
  className?: string
};

const hexToASCII = (str1:string) => {
  const hex = str1.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

export const Governance: React.FC<GovernanceProps> = ({
  className,
}) => {
  const router = useRouter();
  const tezos = useTezos();
  const network = useNetwork();
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const [proposal, selectProposal] = useState<string>('');
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [, setGovContract] = useState<GovernanceStorageInfo>();
  const [proposals, setProposals] = useState<ProposalType[]>([]);
  const [proposalsLoaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadDex = async () => {
      if (!tezos) return;
      if (!network) return;
      const contract = await getStorageInfo(tezos, GOVERNANCE_CONTRACT);
      setGovContract(contract);
      const possibleProposals = new Array(+contract?.id_count.toString())
        .fill(0)
        .map(async (x, id) => (contract?.proposals.get(id)));
      const tempProposals = await Promise.all(possibleProposals);
      if (tempProposals) {
        const proposalsWrapper = tempProposals.filter((x) => !!x).map((x:any, id) => (
          {
            id,
            creator: x.creator,
            config: {
              proposalStake: x.config.proposal_stake,
              votingQuorum: x.config.voting_quorum,
              supportQuorum: x.config.support_quorum,
            },
            status: Object.keys(x.status)[0],
            forumLink: hexToASCII(x.forum_link),
            ipfsLink: hexToASCII(x.ipfs_link),
            endDate: x.end_date,
            startDate: x.start_date,
            votesAgainst: x.votes_against,
            votesFor: x.votes_for,
          }
        ));
        const loadDescription = async (x:any) => {
          const url = prepareIpfsLink(x.ipfsLink);
          if (!url) return null;
          const resp = await (fetch(url));
          const text = await (resp.text());
          return {
            ...x,
            name: text && text.split('title:').length > 1
              ? text.split('title:')[1].split('\r\nauthor:')[0]
              : '<WRONG PROPOSAL NAME>',
          };
        };
        const promisesFullProposals = proposalsWrapper.map(loadDescription);
        const proposalsWithName = await Promise.all(promisesFullProposals);
        console.log(proposalsWithName);
        setProposals(proposalsWithName as ProposalType[]);
      }
      setLoaded(true);
    };
    loadDex();
  }, [tezos, network]);

  const handleUnselect = () => selectProposal('');

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

  const proposalObj = proposals.find((x) => `${x.id}` === proposal);

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

  return (
    <>
      <Card
        className={cx(className, themeClass[colorThemeMode])}
      >
        <CardContent className={s.container}>
          <PieChart
            data={[
              { value: 2, color: '#1373E4', label: 'On-going' },
              { value: 4, color: '#2ED33E', label: 'Approved' },
              { value: 6, color: '#F9A605', label: 'Pending' },
              { value: 8, color: '#EA2424', label: 'Failed' },
              { value: 10, color: '#8B90A0', label: 'Activated' },
            ]}
            legend
            label="Proposals summary"
            showTotal
            className={s.chart}
          />
          <div className={s.voteInfo}>
            <div className={s.deviceRow}>
              <div className={s.voteRow}>
                <div className={s.voteCat}>Total vetoed QNOTs:</div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
              <div className={s.voteRow}>
                <div className={s.voteCat}>Total QNOTs balance:</div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
              <div className={s.voteRow}>
                <div className={s.voteCat}>Your Voted QNOTs:</div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
              <div className={s.voteRow}>
                <div className={s.voteCat}>Total Climable QNOTs:</div>
                <div className={s.voteNum}>1,000,000.00</div>
              </div>
            </div>
            <div className={s.voteButtons}>
              <Button
                href="/governance-submit"
                theme="secondary"
                className={s.voteButton}
              >
                Submit proposal
              </Button>
              <Button className={s.voteButton}>
                Claim unlocked
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

        {proposals
          .filter((x) => tabsState === 'all' || x.status === tabsState)
          .map(transformProposalToGovernanceProps)
          .map((x) => (
            <GovernanceCard
              key={x.id}
              {...x}
              href={`/governance/${x.id}`}
            />
          ))}

        {/* {content.map((x) => (
          <GovernanceCard
            key={x.id}
            {...x}
            href={typeof x.name === 'string'
            ? `/governance/${x.name.split(' ').join('-').split('/')[0]}`
            : '#'}
          />
        ))} */}

      </StickyBlock>
    </>
  );
};
