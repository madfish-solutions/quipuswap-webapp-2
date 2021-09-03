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

export const Governance: React.FC<GovernanceProps> = ({
  className,
}) => {
  const router = useRouter();
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const [proposal, selectProposal] = useState<string>('');
  const { colorThemeMode } = useContext(ColorThemeContext);

  const content: GovernanceCardProps[] = [{
    name: 'Add USDs/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: 'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md',
    shortDescription: `Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Sit adipiscing placerat
    augue gravida nunc. Enim sit volutpat ut amet, viverra.`,
    remaining: new Date(Date.now() + (3600 * 24000 * 3) + 4500000),
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
    remaining: new Date(Date.now() + (3600 * 24000 * 3) + 1300000),
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
    remaining: new Date(Date.now() + (3600 * 24000 * 3) + 4500000),
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
              { value: 10, color: '#A1A4B1', label: 'Activated' },
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
                    router.replace(`${router.asPath}?status=${val}`, undefined, { shallow: true });
                  }}
                  className={s.govTabs}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {content.map((x) => (
          <GovernanceCard
            key={x.id}
            {...x}
            href={typeof x.name === 'string' ? `/governance/${x.name.split(' ').join('-').split('/')[0]}` : '#'}
          />
        ))}

      </StickyBlock>
    </>
  );
};
