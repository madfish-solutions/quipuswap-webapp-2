import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { FARM_CONTRACT, STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm, WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { FarmingInfo } from '@components/farming/FarmingInfo';
import { FarmingStats } from '@components/farming/FarmingStats';
import { FarmingCard } from '@components/farming/FarmingCard';
import { SliderUI } from '@components/ui/Slider';
import Search from '@icons/Search.svg';

import { ApyModal } from '@components/modals/ApyModal';
import { SelectUI } from '@components/ui/Select';
import {
  getStorageInfo,
  useAccountPkh,
  useNetwork,
  useTezos
} from '@utils/dapp';
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

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Farm: React.FC<FarmProps> = () => {
  const [selectedFarming, selectFarm] = useState<WhitelistedFarm>();
  const [sort, setSort] = useState('Sorted By');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const tezos = useTezos();
  const network = useNetwork();
  const [totalFarms, setTotalFarms] = useState<WhitelistedFarm[]>([]);
  const accountPkh = useAccountPkh();

  useEffect(() => {
    const loadDex = async () => {
      if (!tezos) return;
      if (!network) return;
      const contract = await getStorageInfo(tezos, FARM_CONTRACT);
      console.log({ contract });
      const possibleFarms = new Array(+contract?.storage.farms_count.toString())
        .fill(0)
        .map(async (x, id) => (contract?.storage.farms.get(id)));
      const tempFarms = await Promise.all(possibleFarms);
      console.log({ tempFarms });
      console.log('users-info', await contract.storage.users_info.get({ '@nat_57': tempFarms[0].fid.toString(), '@address_58': accountPkh }));
      if (tempFarms) {
        const totalFarmsWrapper = tempFarms
          .filter((x) => !!x)
          .map((x, id) => {
            console.log({ x });
            return {
              id,
              tokenPair: fallbackPair,
              totalValueLocked: x.staked,
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
            }
          });
        console.log({ totalFarmsWrapper });
        setTotalFarms(totalFarmsWrapper);
      }
    };
    loadDex();
  }, [tezos, network, accountPkh]);

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
      {totalFarms.map((x) => (
        <FarmingCard
          key={x.multiplier}
          farm={x}
          onClick={(e) => selectFarm(e)}
          openModal={() => setModalOpen(true)}
        />
      ))}
    </>
  );
};
