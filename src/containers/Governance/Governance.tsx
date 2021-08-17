import React, { useState } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import { StickyBlock } from '@components/common/StickyBlock';
import { PieChartSampleData } from '@components/ui/PieChart/content';

import s from '@styles/CommonContainer.module.sass';

import { GovernanceCard, GovernanceCardProps, GovernanceInfo } from './GovernanceCard';

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

type GovernanceProps = {
  className?: string
};

export const Governance: React.FC<GovernanceProps> = ({
  className,
}) => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [proposal, selectProposal] = useState<string>('');

  const content: GovernanceCardProps[] = [{
    name: 'Add USDs/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: 'https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1155.md',
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
    name: 'Add USDs/QNOT pool',
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
  }];

  const handleUnselect = () => selectProposal('');

  const proposalObj = content.find((x) => x.id === proposal);
  if (proposal && proposalObj) {
    return (
      <div className={cx(className, s.proposal)}>
        <GovernanceInfo
          {...proposalObj}
          onClick={() => {
            // TODO
          }}
          handleUnselect={handleUnselect}
        />

      </div>
    );
  }

  return (
    <>
      <PieChart data={PieChartSampleData} />
      <StickyBlock className={cx(className, s.unsticky)}>
        <Card
          className={cx(s.govCard, s.mb24i)}
        >
          <CardContent className={s.tabContent}>
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.govTabs}
            />
          </CardContent>
        </Card>

        {content.map((x) => (
          <GovernanceCard
            key={x.id}
            {...x}
            onClick={() => selectProposal(x.id)}
          />
        ))}

      </StickyBlock>
    </>
  );
};
