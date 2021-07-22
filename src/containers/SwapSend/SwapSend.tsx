import React, { useMemo, useState } from 'react';
import cx from 'classnames';

import { WhitelistedToken } from '@utils/types';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexInput, ComplexRecipient } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { StickyBlock } from '@components/common/StickyBlock';
import { TokensModal } from '@components/modals/TokensModal';
import { Slippage } from '@components/common/Slippage';
import { Route } from '@components/common/Route';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { SwapIcon } from '@components/svg/Swap';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

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
  const [tokensModal, setTokensModal] = useState<number>(0);
  const [token1, setToken1] = useState<WhitelistedToken>();
  const [token2, setToken2] = useState<WhitelistedToken>();
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added
  const handleInputChange = (state: any) => {
    setInputValue(state.target.value);
  }; // TODO: Delete when lib added

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  console.log(token1, token2);

  return (
    <StickyBlock className={className}>
      <TokensModal
        isOpen={tokensModal !== 0}
        onRequestClose={() => setTokensModal(0)}
        onChange={(token) => {
          if (tokensModal === 1) setToken1(token);
          else setToken2(token);
          setTokensModal(0);
        }}
      />
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
          onClick={() => setTokensModal(1)}
          handleBalance={(value) => setInputValue(value)}
          id="swap-send-from"
          label="From"
          className={s.input}
          token1={{ name: token1?.metadata.symbol ?? 'TOKEN', icon: token1?.metadata.thumbnailUri }}
        />
        <Button
          theme="quaternary"
          className={s.iconButton}
        >
          <SwapIcon />
        </Button>
        <ComplexInput
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setTokensModal(2)}
          handleBalance={(value) => setInputValue(value)}
          id="swap-send-to"
          label="To"
          className={cx(s.input, s.mb24)}
          token1={{ name: token2?.metadata.symbol ?? 'TOKEN', icon: token2?.metadata.thumbnailUri }}
        />
        {currentTab.id === 'send' && (
          <ComplexRecipient
            value={inputValue}
            onChange={handleInputChange}
            handleInput={(state) => setInputValue(state)}
            label="Recipient address"
            id="swap-send-recipient"
            className={cx(s.input, s.mb24)}
          />
        )}
        <Slippage />
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
      <Card
        header={{
          content: `${currentTab.label} Details`,
        }}
        contentClassName={s.content}
      >
        <CardCell header="Sell Price" className={s.cell}>
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="tez" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
          </div>
        </CardCell>
        <CardCell header="Buy Price" className={s.cell}>
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="QPSP" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
          </div>
        </CardCell>
        <CardCell header="Price impact" className={s.cell}>
          <CurrencyAmount amount="<0.01" currency="%" />
        </CardCell>
        <CardCell header="Fee" className={s.cell}>
          <CurrencyAmount amount="0.001" currency="XTZ" />
        </CardCell>
        <CardCell header="Route" className={s.cell}>
          <Route
            routes={['qpsp', 'usd', 'xtz']}
          />
        </CardCell>
        <Button
          className={s.detailsButton}
          theme="inverse"
        >
          View Pair Analytics
          <ExternalLink className={s.linkIcon} />
        </Button>
      </Card>
    </StickyBlock>
  );
};
