import React, { useState, useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm, WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { FarmingInfo } from '@components/farming/FarmingInfo';
import { FarmingStats } from '@components/farming/FarmingStats';
import { FarmingCard } from '@components/farming/FarmingCard';
import { Shevron } from '@components/svg/Shevron';
import { SliderUI } from '@components/ui/Slider';
import Search from '@icons/Search.svg';

import s from './Farm.module.sass';

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

const fallbackPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

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
    remaining: new Date(Date.now() + 48 * 3600000),
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
    remaining: new Date(Date.now() + 48 * 3600000),
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
    remaining: new Date(Date.now() + 48 * 3600000),
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
    remaining: new Date(Date.now() + 48 * 3600000),
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
    remaining: new Date(Date.now() + 48 * 3600000),
  },
];

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Farm: React.FC<FarmProps> = () => {
  const [selectedFarming, selectFarm] = useState<WhitelistedFarm>();
  const { colorThemeMode } = useContext(ColorThemeContext);
  if (selectedFarming) {
    // TODO
    return (
      <FarmingInfo handleUnselect={() => selectFarm(undefined)} farm={selectedFarming} />
    );
  }
  return (
    <>
      <Card
        className={cx(modeClass[colorThemeMode], s.farmingCard, s.desktop)}
        contentClassName={cx(s.farmingStats)}
      >
        {content.map((x) => (
          <div key={x.name} className={s.farmingStatsBlock}>
            <div className={s.name}>{x.name}</div>
            <CurrencyAmount amount={x.value} currency={x.currency} />
          </div>
        ))}
      </Card>
      <Card
        className={(modeClass[colorThemeMode], s.farmingMobileCard, s.mobile)}
        contentClassName={s.farmingMobileStats}
      >
        <SliderUI
          items={2}
          responsive={[{
            breakpoint: 620,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          }]}
        >
          {content.map((x) => (
            <div key={x.name} className={s.farmingMobileStatsBlock}>
              <div className={s.name}>{x.name}</div>
              <CurrencyAmount amount={x.value} currency={x.currency} />
            </div>
          ))}
        </SliderUI>
      </Card>
      <FarmingStats className={cx(s.farmingCard, s.farmingContent)} />
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
