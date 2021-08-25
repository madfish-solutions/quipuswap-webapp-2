import React, { useState } from 'react';
import cx from 'classnames';

import { TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm, WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { FarmingStats } from '@components/farming/FarmingStats';
import { FarmingCard } from '@components/farming/FarmingCard';
import { Shevron } from '@components/svg/Shevron';
import Search from '@icons/Search.svg';

import s from '@styles/CommonContainer.module.sass';
import { useTranslation } from 'next-i18next';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { CardCell } from '@components/ui/Card/CardCell';
import { Tooltip } from '@components/ui/Tooltip';
import { Route } from '@components/common/Route';
import { ExternalLink } from '@components/svg/ExternalLink';

type FarmProps = {
  className?: string
};

type ContentType = { name:string, value:string, currency?:string }[];

const content:ContentType = [
  {
    name: 'Total Value Locked',
    value: '888888888888888.00',
    currency: 'QPSP',
  },
  {
    name: 'Total Daily Reward',
    value: '888888888888888.00',
  },
  {
    name: 'Total Pending Reward',
    value: '888888888888888.00',
  },
  {
    name: 'Total Claimed Reward',
    value: '888888888888888.00',
    currency: 'QPSP',
  },
];

const fallbackPair:WhitelistedTokenPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
  dex: '',
};

const farms:WhitelistedFarm[] = [
  {
    tokenPair: fallbackPair,
    totalValueLocked: '1000000.00',
    apy: '888%',
    daily: '0.008%',
    balance: '1000000.00',
    deposit: '1000000.00',
    earned: '1000000.00',
    multiplier: '888',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    tokenPair: fallbackPair,
    totalValueLocked: '1000000.00',
    apy: '887%',
    daily: '0.008%',
    balance: '1000000.00',
    deposit: '1000000.00',
    earned: '1000000.00',
    multiplier: '887',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    tokenPair: fallbackPair,
    totalValueLocked: '1000000.00',
    apy: '886%',
    daily: '0.008%',
    balance: '1000000.00',
    deposit: '1000000.00',
    earned: '1000000.00',
    multiplier: '886',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    tokenPair: fallbackPair,
    totalValueLocked: '1000000.00',
    apy: '885%',
    daily: '0.008%',
    balance: '1000000.00',
    deposit: '1000000.00',
    earned: '1000000.00',
    multiplier: '885',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    tokenPair: fallbackPair,
    totalValueLocked: '1000000.00',
    apy: '884%',
    daily: '0.008%',
    balance: '1000000.00',
    deposit: '1000000.00',
    earned: '1000000.00',
    multiplier: '884',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
];

export const Farm: React.FC<FarmProps> = () => {
  const { t } = useTranslation(['common']);
  const [selectedFarming, selectFarm] = useState<WhitelistedFarm>();
  if (selectedFarming) {
    // TODO
    return (
      <StickyBlock>
        <Card>
          <Slippage />
          <div className={s.receive}>
            <span className={s.receiveLabel}>
              Minimum received:
            </span>
            <CurrencyAmount amount="1233" currency="XTZ" />
          </div>
          <Button className={s.button}>
            Quo
          </Button>
        </Card>
        <Card
          header={{
            content: 'Details',
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
  }
  return (
    <>
      <Card className={s.farmingCard} contentClassName={s.farmingStats}>
        {content.map((x) => (
          <div key={x.name} className={s.farmingStatsBlock}>
            <div>{x.name}</div>
            <CurrencyAmount amount={x.value} currency={x.currency} />
          </div>
        ))}
      </Card>
      <FarmingStats className={s.farmingCard} />
      <Card
        className={cx(s.farmingCard, s.farmingControllerCard)}
        contentClassName={cx(s.farmingStats, s.farmingControllerContent)}
      >
        <Input
          StartAdornment={Search}
          className={s.searchInput}
          placeholder="Search"
        />
        <div className={s.switcherWrap}>
          <Switcher
            isActive
            onChange={() => {}}
            className={s.switcherInput}
          />
          <div className={s.switcher}>
            Staked Only
          </div>
        </div>
        <Button theme="quaternary" className={s.sortItem}>
          Sorted By
          <Shevron />
        </Button>
      </Card>
      {farms.map((x) => (
        <FarmingCard
          key={x.multiplier}
          farm={x}
          onClick={(e) => selectFarm(e)}
        />
      ))}
    </>
  );
};
