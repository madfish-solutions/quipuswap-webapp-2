import React, { useMemo, useState } from 'react';
import cx from 'classnames';

import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexInput, ComplexRecipient } from '@components/ui/ComplexInput';
import { Transactions } from '@components/svg/Transactions';
import { SwapIcon } from '@components/svg/Swap';

import { StickyBlock } from '@components/common/StickyBlock';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import s from './SwapSend.module.sass';

const TabsContent = [
  {
    id: 'swap',
    label: 'Swap',
  },
  {
    id: 'send',
    label: 'Send',
  },
];

type SwapSendProps = {
  className?: string
};

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added
  const handleInputChange = (state: any) => {
    setInputValue(state.target.value);
  }; // TODO: Delete when lib added

  const currentTab = useMemo(
    () => (TabsContent.filter(({ id }) => id === tabsState)[0]),
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
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="swap-send-from"
          label="From"
          className={s.input}
        />
        <Button
          theme="quaternary"
          className={s.swapButton}
        >
          <SwapIcon />
        </Button>
        <ComplexInput
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="swap-send-to"
          label="To"
          className={s.input}
        />
        {currentTab.id === 'send' && (
          <ComplexRecipient
            value={inputValue}
            onChange={handleInputChange}
            handleInput={(state) => setInputValue(state)}
            label="Recipient address"
            id="swap-send-recipient"
            className={s.input}
          />
        )}
        {/* Slippage */}
        <div className={s.receive}>
          <span className={s.receiveLabel}>
            Minimum received:
          </span>
          <CurrencyAmount amount="1233" currency="XTZ" />
        </div>
        <Button className={s.button}>
          {currentTab.label}
        </Button>
      </Card>
    </StickyBlock>
  );
};
