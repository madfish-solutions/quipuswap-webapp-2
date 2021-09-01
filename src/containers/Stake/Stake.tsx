import React, { useState } from 'react';
import cx from 'classnames';

import { TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedStake, WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { StakeInfo } from '@components/stake/StakeInfo';
import { StakeCard } from '@components/stake/StakeCard';
import { Shevron } from '@components/svg/Shevron';
import Search from '@icons/Search.svg';

import s from '@styles/CommonContainer.module.sass';

type StakeProps = {
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

const stakes:WhitelistedStake[] = [
  {
    tokenPair: fallbackPair,
    totalValueLocked: '1000000.00',
    apy: '888%',
    daily: '0.008%',
    balance: '1000000.00',
    deposit: '1000000.00',
    earned: '1000000.00',
    earn: 'CRUNCH',
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
    earn: 'PAUL',
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
    earn: 'MAG',
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
    earn: 'QUIPU',
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
    earn: 'TEZ',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
    remaining: new Date(Date.now() + 48 * 3600000),
  },
];

export const Stake: React.FC<StakeProps> = () => {
  const [selectedStake, selectStake] = useState<WhitelistedStake>();
  if (selectedStake) {
    // TODO
    return (
      <StakeInfo handleUnselect={() => selectStake(undefined)} stake={selectedStake} />
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
      {stakes.map((x) => (
        <StakeCard
          key={x.earn}
          stake={x}
          onClick={(e) => selectStake(e)}
        />
      ))}
    </>
  );
};
