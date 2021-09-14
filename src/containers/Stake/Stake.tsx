import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import cx from 'classnames';
import Slider from 'react-slick';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedStake, WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { SelectUI } from '@components/ui/Select';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { StakeInfo } from '@components/stake/StakeInfo';
import { StakeCard } from '@components/stake/StakeCard';
import Search from '@icons/Search.svg';

import { useRouter } from 'next/router';
import { ApyModal } from '@components/modals/ApyModal';
import s from './Stake.module.sass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type StakeProps = {
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
    id: 0,
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
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Stake: React.FC<StakeProps> = () => {
  const router = useRouter();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [selectedStake, selectStake] = useState<WhitelistedStake>();
  const [sort, setSort] = useState('Sorted By');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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

  useEffect(() => {
    if (router.query.slug) {
      const stakeObj = stakes.find((x) => `${x.id}` === router.query.slug);
      if (stakeObj) {
        selectStake(stakeObj);
      }
    }
  }, [router.query, selectedStake]);

  if (selectedStake) {
    return (
      <StakeInfo stake={selectedStake} />
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: () => (
      <div className={modeClass[colorThemeMode]}>
        <div className={s.dot} />

      </div>
    ),
  };

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
        className={(modeClass[colorThemeMode], s.farmingMobileCard, s.mobile)}
        contentClassName={s.farmingMobileStats}
      >
        <Slider {...settings}>
          {content.map((x) => (
            <div key={x.name} className={s.farmingMobileStatsBlock}>
              <div className={s.name}>{x.name}</div>
              <CurrencyAmount amount={x.value} currency={x.currency} />
            </div>
          ))}
        </Slider>
      </Card>
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
        <div
          className={s.sortItem}
        >
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
      {stakes.map((x) => (
        <StakeCard
          key={x.earn}
          stake={x}
          openModal={() => setModalOpen(true)}
        />
      ))}
    </>
  );
};
