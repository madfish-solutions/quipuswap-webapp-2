import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  GovernanceCard, GovernanceCardProps, GovernanceInfo,
} from '@containers/Governance/GovernanceCard';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { StickyBlock } from '@components/common/StickyBlock';

import s from '@styles/CommonContainer.module.sass';
import { getStorageInfo, useNetwork, useTezos } from '@utils/dapp';
import { GOVERNANCE_CONTRACT, STABLE_TOKEN } from '@utils/defaults';
import { GovernanceStorageInfo, ProposalType } from '@utils/types';
import { getWhitelistedTokenSymbol } from '@utils/helpers';

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

const currencyCoin = getWhitelistedTokenSymbol(STABLE_TOKEN);

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

  useEffect(() => {
    const loadDex = async () => {
      if (!tezos) return;
      if (!network) return;
      const contract = await getStorageInfo(tezos, GOVERNANCE_CONTRACT);
      setGovContract(contract);
      console.log(contract);
      const tempProposals = await Promise.all(
        new Array(contract?.id_count)
          .fill(0)
          .map(async (x, id) => (contract?.proposals.get(id))),
      );
      if (tempProposals) {
        console.log(tempProposals);
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
        setProposals(proposalsWrapper as ProposalType[]);
      }
    };
    loadDex();
  }, [tezos, network]);

  console.log(proposals);

  const content: GovernanceCardProps[] = [{
    name: 'Add USDs/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: 'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md',
    shortDescription: `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Sit adipiscing placerat
    augue gravida nunc. Enim sit volutpat ut amet, viverra.`,
    voted: '100,000.00',
    support: '100,000.00',
    reject: '100,000.00',
    votes: '0',
    claimable: '0',
    id: '0',
    currency: 'QNOT',
    author: 'tz1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  }, {
    name: 'Add USDC/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: 'https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1155.md',
    shortDescription: `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Sit adipiscing placerat
    augue gravida nunc. Enim sit volutpat ut amet, viverra.`,
    voted: '100,000.00',
    support: '100,000.00',
    reject: '100,000.00',
    votes: '0',
    claimable: '0',
    id: '1',
    currency: 'QNOT',
    author: 'tz1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  }, {
    name: 'Add PLENTY/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: 'https://gist.githubusercontent.com/Jekins/2bf2d0638163f1294637/raw/9f93ad0b8b70ab5070ff96e54c4ee23d25a8798e/Markdown-docs.md',
    shortDescription: `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Sit adipiscing placerat
    augue gravida nunc. Enim sit volutpat ut amet, viverra.`,
    voted: '100,000.00',
    support: '100,000.00',
    reject: '100,000.00',
    votes: '0',
    claimable: '0',
    id: '2',
    currency: 'QNOT',
    author: 'tz1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  }];

  const handleUnselect = () => selectProposal('');

  useEffect(() => {
    if (router.query.status
      && router.query.status !== tabsState
      && TabsContent.some((tab) => tab.id === router.query.status)) {
      setTabsState(router.query.status.toString());
    }
    if (router.query.proposal) {
      const proposalObj = content.find((x) => x.name.split(' ').join('-').split('/')[0] === router.query.proposal);
      if (proposalObj) {
        selectProposal(proposalObj.id);
      }
    }
  }, [router.query]);

  const proposalObj = content.find((x) => x.id === proposal);
  if (proposal && proposalObj) {
    return (
      <div className={cx(className, s.proposal)}>
        <GovernanceInfo
          {...proposalObj}
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
        <div className={cx(s.fullWidth, s.governTabs)}>
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
          .map((x) => ({
            name: 'Add USDs/QNOT pool',
            description: 'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md',
            shortDescription: `Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sit adipiscing placerat
            augue gravida nunc. Enim sit volutpat ut amet, viverra.`,
            workDates: [new Date(x.startDate), new Date(x.endDate)],
            status: x.status.toUpperCase(),
            currency: currencyCoin,
            voted: x.votesFor.toString(),
            support: '100,000.00',
            reject: x.votesAgainst.toString(),
            votes: '0',
            claimable: '0',
            id: `${x.id}`,
            author: x.creator,
          }) as GovernanceCardProps)
          .map((x) => (
            <GovernanceCard
              key={x.id}
              {...x}
              href={typeof x.name === 'string' ? `/governance/${x.name.split(' ').join('-').split('/')[0]}` : '#'}
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
