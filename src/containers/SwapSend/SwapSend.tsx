import React, { useMemo, useState, useEffect } from 'react';
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
import { useTranslation } from 'next-i18next';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
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

type TokenDataType = {
  token: {
    address: string,
    type: 'fa1.2' | 'fa2',
    id?: number
    decimals: number,
  },
  balance: string,
  exchangeRate?: string
};

const fallbackTokensData : TokenDataType = {
  token: {
    address: 'tez',
    type: 'fa1.2',
    decimals: 6,
  },
  balance: '0',
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

  const { t } = useTranslation(['common', 'swap']);
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

        const fromAsset = {
          contract: tokensData.first.token.address,
          id: tokensData.first.token.id ?? 0,
        };
        const toAsset = {
          contract: tokensData.second.token.address,
          id: tokensData.second.token.id ?? 0,
        };
        const inputValueInner = +state.target.value; // in mutez (without decimals)
        console.log('fromAsset', fromAsset);
        console.log('toAsset', toAsset);

        try {
          const estimatedOutputValue = await estimateSwap(
            tezos,
            factories,
            fromAsset,
            toAsset,
            { inputValue: inputValueInner },
          );
          console.info({ estimatedOutputValue });
        } catch (e) {
          // code above fails every time on XTZ
          // console.error(e);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }; // TODO: Delete when lib added
  const [token1, setToken1] = useState<WhitelistedToken>(TEZOS_TOKEN);
  const [token2, setToken2] = useState<WhitelistedToken>(TEZOS_TOKEN);

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
      token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined ? el
        : el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

    // console.log('tokenExchangeRate', tokenExchangeRate);

    setTokensData((prevState) => (
      {
        ...prevState,
        [tokenNumber]: {
          token: {
            address: token.contractAddress,
            type: token.type,
            id: token.type === 'fa2' ? token.fa2TokenId : null,
            decimals: token.metadata.decimals,
          },
          balance: finalBalance,
          exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
        },
      }
    ));
  };

  useEffect(() => {
    if (!tokensData.first.exchangeRate) {
      handleTokenChange(
        {
          contractAddress: tokensData.first.token.address,
          type: tokensData.first.token.type,
          metadata:
          {
            decimals: tokensData.first.token.decimals,
          },
        } as WhitelistedToken, 'first',
      );
    }
    if (!tokensData.second.exchangeRate) {
      handleTokenChange(
        {
          contractAddress: tokensData.second.token.address,
          type: tokensData.second.token.type,
          metadata:
        {
          decimals: tokensData.second.token.decimals,
        },
        } as WhitelistedToken, 'second',
      );
    }
  }, [exchangeRates]);

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
          token={token2}
          setToken={setToken2}
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
        <CardCell
          header={(
            <>
              {t('common:Sell Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}
              />
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
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}
              />
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
              <Tooltip
                sizeT="small"
                content={t('swap:The impact your transaction is expected to make on the exchange rate.')}
              />
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
              <Tooltip
                sizeT="small"
                content={t('swap:Expected fee for this transaction charged by the Tezos blockchain.')}
              />
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
              <Tooltip
                sizeT="small"
                content={t("swap:When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")}
              />
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
