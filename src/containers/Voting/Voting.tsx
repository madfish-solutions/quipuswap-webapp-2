import React, { useMemo, useState } from 'react';
import cx from 'classnames';

import { TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { CardCell } from '@components/ui/Card/CardCell';
import { StickyBlock } from '@components/common/StickyBlock';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

const TabsContent = [
  {
    id: 'vote',
    label: 'Vote',
  },
  {
    id: 'veto',
    label: 'Veto',
  },
];

type VotingProps = {
  className?: string
};

export const Voting: React.FC<VotingProps> = ({
  className,
}) => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added
  const handleInputChange = (state: any) => {
    setInputValue(state.target.value);
  }; // TODO: Delete when lib added

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  return (
    <StickyBlock className={className}>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.tabs}
            />
          ),
          button: (
            <Button
              theme="quaternary"
            >
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <ComplexInput
          token1={TEZOS_TOKEN}
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="voting-input"
          label="Votes"
          className={cx(s.input, s.mb24)}
          mode="votes"
        />
        {currentTab.id === 'vote' && (
          <ComplexBaker
            label="Baker"
            id="voting-baker"
          />
        )}
        <div className={s.buttons}>
          <Button className={s.button} theme="secondary">
            {currentTab.id === 'vote' ? 'Unvote' : 'Remove veto'}
          </Button>
          <Button className={s.button}>
            {currentTab.label}
          </Button>
        </div>
      </Card>
      <Card
        header={{
          content: 'Voting Details',
        }}
        contentClassName={s.content}
      >
        <CardCell header="Delegated To" className={s.cell}>
          <Button theme="underlined">
            Everstake
          </Button>
        </CardCell>
        <CardCell header="Second Candidate" className={s.cell}>
          <Button theme="underlined">
            Bake’n’Roll
          </Button>
        </CardCell>
        <CardCell header="Total Votes" className={s.cell}>
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell header="Total Vetos" className={s.cell}>
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell header="Your Candidate" className={s.cell}>
          <Button theme="underlined">
            Bake’n’Roll
          </Button>
        </CardCell>
        <CardCell header="Total Votes" className={s.cell}>
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Delegation Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
        </div>
      </Card>
    </StickyBlock>
  );
};
