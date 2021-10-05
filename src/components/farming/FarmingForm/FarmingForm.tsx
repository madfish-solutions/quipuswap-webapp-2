import React, {
  useMemo, useState,
} from 'react';
import cx from 'classnames';
import { FormSpy } from 'react-final-form';

import { TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { StickyBlock } from '@components/common/StickyBlock';
import { FarmingDetails } from '@components/farming/FarmingDetails';
import { Transactions } from '@components/svg/Transactions';

import s from './FarmingForm.module.sass';

const TabsContent = [
  {
    id: 'stake',
    label: 'Stake',
  },
  {
    id: 'unstake',
    label: 'Unstake',
  },
];

type FarmingFormProps = {
  remaining: Date,
  amount: string
};

const RealForm:React.FC<FarmingFormProps> = ({
  remaining,
  amount,
}) => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  return (

    <StickyBlock>
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
          value={100000}
          onChange={() => {}}
          handleBalance={() => {}}
          id="voting-input"
          label="Amount"
          className={cx(s.input, s.mb24)}
          mode="votes"
        />
        {currentTab.id === 'stake' && (
          <ComplexBaker
            className={s.baker}
            label="Baker"
            id="voting-baker"
          />
        )}
        <div className={s.tradeControls}>
          <Button theme="underlined" className={s.tradeBtn}>
            Trade
          </Button>
          {currentTab.id === 'stake' ? (
            <Button theme="underlined" className={s.tradeBtn}>
              Invest
            </Button>
          ) : (
            <Button theme="underlined" className={s.tradeBtn}>
              Divest
            </Button>
          )}

        </div>
        <div className={s.buttons}>
          <Button className={s.button}>
            {currentTab.label}
          </Button>
        </div>
      </Card>

      {/* FARM */}
      <FarmingDetails
        remaining={remaining}
        amount={amount}
      />
    </StickyBlock>
  );
};

export const FarmingForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
