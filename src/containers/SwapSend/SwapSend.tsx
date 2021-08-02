import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { WhitelistedToken } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { StickyBlock } from '@components/common/StickyBlock';
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
  const { t } = useTranslation(['common', 'swap']);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added
  const handleInputChange = (state: any) => {
    setInputValue(state.target.value);
  }; // TODO: Delete when lib added
  const [token1, setToken1] = useState<WhitelistedToken>(TEZOS_TOKEN);
  const [token2, setToken2] = useState<WhitelistedToken>(TEZOS_TOKEN);

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
        <TokenSelect
          token={token1}
          setToken={setToken1}
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="swap-send-from"
          label="From"
          className={s.input}
        />
        <Button
          theme="quaternary"
          className={s.iconButton}
        >
          <SwapIcon />
        </Button>
        <TokenSelect
          token={token2}
          setToken={setToken2}
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="swap-send-to"
          label="To"
          className={cx(s.input, s.mb24)}
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
        <CardCell
          header={(
            <>
              {t('common:Sell Price')}
              <Tooltip content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')} />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="tez" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Buy Price')}
              <Tooltip content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')} />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="QPSP" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Price impact')}
              <Tooltip content={t('swap:The impact your transaction is expected to make on the exchange rate.')} />
            </>
        )}
          className={s.cell}
        >
          <CurrencyAmount amount="<0.01" currency="%" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Fee')}
              <Tooltip content={t('swap:Expected fee for this transaction charged by the Tezos blockchain.')} />
            </>
        )}
          className={s.cell}
        >
          <CurrencyAmount amount="0.001" currency="XTZ" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Route')}
              <Tooltip content={t("swap:When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")} />
            </>
        )}
          className={s.cell}
        >
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
