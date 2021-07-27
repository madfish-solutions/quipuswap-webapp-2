import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { estimateSwap } from '@quipuswap/sdk';

import { WhitelistedToken } from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  getUserBalance,
} from '@utils/dapp';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
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

const fallbackTokensData = {
  token: {
    address: 'tez',
    id: null,
  },
  balance: '0',
  exchangeRate: null,
};

const factories = {
  fa1_2Factory: [
    'KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw',
    'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD',
  ],
  fa2Factory: [
    'KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ',
    'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS',
  ],
};

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();

  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes

  const [tokensData, setTokensData] = useState(
    {
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added

  const handleInputChange = async (state: any) => {
    setInputValue(state.target.value);
    if (tezos) {
      try {
        console.log('tokensData', tokensData);

        const fromAsset = tokensData.first.token.id
          ? { contract: tokensData.first.token.address, id: tokensData.first.token.id }
          : { contract: tokensData.first.token.address };
        const toAsset = tokensData.second.token.id
          ? { contract: tokensData.second.token.address, id: tokensData.second.token.id }
          : { contract: tokensData.second.token.address };
        const inputValueInner = +state.target.value; // in mutez (without decimals)
        console.log('fromAsset', fromAsset);
        console.log('toAsset', toAsset);

        const estimatedOutputValue = await estimateSwap(
          tezos,
          factories,
          fromAsset,
          toAsset,
          { inputValue: inputValueInner },
        );

        console.info({ estimatedOutputValue });
      } catch (err) {
        console.error(err);
      }
    }
  }; // TODO: Delete when lib added

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleTokenChange = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    let finalBalance = '0';
    if (tezos && accountPkh) {
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId ?? 0,
      );
      if (balance) {
        finalBalance = balance.div(
          new BigNumber(10)
            .pow(
              new BigNumber(token.metadata.decimals),
            ),
        ).toString();
      }
    }

    const tokenExchangeRate = exchangeRates.find((el: {
      tokenAddress: string,
      tokenId?: number,
      exchangeRate: string
    }) => (
      el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

    setTokensData((prevState) => (
      {
        ...prevState,
        [tokenNumber]: {
          token: {
            address: token.contractAddress,
            id: token.type === 'fa2' ? token.fa2TokenId : null,
          },
          balance: finalBalance,
          exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
        },
      }
    ));
  };

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
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          handleChange={(token) => handleTokenChange(token, 'first')}
          balance={tokensData.first.balance}
          exchangeRate={tokensData.first.exchangeRate}
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
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          handleChange={(token) => handleTokenChange(token, 'second')}
          balance={tokensData.second.balance}
          exchangeRate={tokensData.second.exchangeRate}
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
