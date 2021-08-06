import React, { useState } from 'react';
import cx from 'classnames';

import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { StickyBlock } from '@components/common/StickyBlock';

import s from '@styles/CommonContainer.module.sass';
import { GovernanceCard, GovernanceCardProps } from './GovernanceCard';

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

  const content: GovernanceCardProps[] = [{
    name: 'Add USDs/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: `Lorem ipsum dolor sit amet, consectetur
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
  }, {
    name: 'Add USDs/QNOT pool',
    workDates: [new Date('1 JUN 2021'), new Date('1 JUN 2022')],
    status: 'PENDING',
    description: `Lorem ipsum dolor sit amet, consectetur
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
  }];

  return (
    <StickyBlock className={cx(className, s.unsticky)}>
      <Card
        className={cx(s.fullWidth, s.mb24i)}
        contentClassName={s.tabContent}
      >
        <Tabs
          values={TabsContent}
          activeId={tabsState}
          setActiveId={(val) => setTabsState(val)}
          className={s.tabs}
        />
      </Card>

      {content.map((x) => <GovernanceCard key={x.id} {...x} />)}

    </StickyBlock>
  );
};
