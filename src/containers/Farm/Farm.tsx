import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm, WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { SelectUI } from '@components/ui/Select';
import { SliderUI } from '@components/ui/Slider';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { FarmingInfo } from '@components/farming/FarmingInfo';
import { FarmingStats } from '@components/farming/FarmingStats';
import { FarmingCard } from '@components/farming/FarmingCard';
import { ApyModal } from '@components/modals/ApyModal';
import Search from '@icons/Search.svg';

import s from './Farm.module.sass';

type FarmProps = {
  className?: string
};

type ContentType = { name:string, value:string, currency?:string }[];

const SortContent = [
  {
    id: 'asc:token',
    label: 'Deposit token',
  },
  {
    id: 'asc:tvl',
    label: 'TVL',
  },
  {
    id: 'asc:apy',
    label: 'APY',
  },
  {
    id: 'asc:deposit',
    label: 'Deposit',
  },
];

const content:ContentType = [
  {
    name: 'Total Value Locked',
    value: '888888888888888.00',
    currency: STABLE_TOKEN.metadata.symbol,
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
    currency: STABLE_TOKEN.metadata.symbol,
  },
];

const fallbackPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

const farms:WhitelistedFarm[] = [
  {
    id: 0,
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
  const router = useRouter();
  const [selectedFarming, selectFarm] = useState<WhitelistedFarm>();
  const [sort, setSort] = useState('Sorted By');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { colorThemeMode } = useContext(ColorThemeContext);

  useEffect(() => {
    if (router.query.slug) {
      const farmObj = farms.find((x) => `${x.id}` === router.query.slug);
      if (farmObj) {
        selectFarm(farmObj);
      }
    }
  }, [router.query, selectedFarming]);

  const currentSort = useMemo(
    () => (SortContent.find(({ id }) => id === sort)!),
    [sort],
  );
  const selectValues = useMemo(
    () => SortContent.map((el) => ({ value: el.id, label: el.label })),
    [],
  );
  const handleChangeSort = useCallback(({ value, label }) => {
    const selectedSort = SortContent.find((sorting) => (
      sorting.id === value && sorting.label === label
    ));
    if (!selectedSort) return;
    setSort(selectedSort.id);
  }, []);

  if (selectedFarming) {
    // TODO
    return (
      <FarmingInfo handleUnselect={() => selectFarm(undefined)} farm={selectedFarming} />
    );
  }
  return (
    <>
      <ApyModal isOpen={modalOpen} close={() => setModalOpen(false)} />
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
        className={cx(modeClass[colorThemeMode], s.farmingMobileCard, s.mobile)}
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
              <CurrencyAmount
                amount={x.value}
                currency={x.currency}
                labelSize="large"
              />
            </div>
          ))}
        </SliderUI>
      </Card>
      <FarmingStats className={cx(s.farmingCard, s.farmingContent)} />
      <Card
        className={cx(modeClass[colorThemeMode], s.farmingCard, s.farmingControllerCard)}
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
        <div className={s.sortItem}>
          <SelectUI
            className={s.select}
            options={selectValues}
            value={currentSort
              ? { value: currentSort.id, label: currentSort.label }
              : { value: 'Sorted By', label: 'Sorted By' }}
            onChange={handleChangeSort}
          />
        </div>
      </Card>
      {farms.map((x) => (
        <FarmingCard
          key={x.multiplier}
          farm={x}
          openModal={() => setModalOpen(true)}
        />
      ))}
    </>
  );
};
