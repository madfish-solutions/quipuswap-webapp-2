import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';
import { useRouter } from 'next/router';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { STABLE_TOKEN } from '@utils/defaults';
import { WhitelistedFarmOptional } from '@utils/types';
import { sortFarms } from '@utils/helpers';
import { useMergedFarmsInfo } from '@hooks/useMergedFarmsInfo';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { SliderUI } from '@components/ui/Slider';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { FarmingInfo } from '@components/farming/FarmingInfo';
import { FarmingStats } from '@components/farming/FarmingStats';
import { FarmingCard } from '@components/farming/FarmingCard';
import { ApyModal } from '@components/modals/ApyModal';
import { SelectUI } from '@components/ui/Select';
import Search from '@icons/Search.svg';

import s from './Farm.module.sass';

type FarmProps = {
  className?: string
};

type ContentType = { name:string, value:string, currency?:string }[];

const SortContent = [
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

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Farm: React.FC<FarmProps> = () => {
  const mergedFarms = useMergedFarmsInfo();
  const router = useRouter();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [selectedFarming, selectFarm] = useState<WhitelistedFarmOptional>();
  const { t } = useTranslation(['common']);
  const [sort, setSort] = useState('Sorted By');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const sortedFarms = useMemo(() => sortFarms(sort, mergedFarms ?? []), [sort, mergedFarms]);

  const filteredFarms = useMemo(() => sortedFarms.filter((farm) => ((
    farm.tokenPair.token1.metadata.name.toLowerCase().includes(search.toLowerCase())
  ) || (
    farm.tokenPair.token2?.metadata.name.toLowerCase().includes(search.toLowerCase())
  ))), [search, sortedFarms]);

  useEffect(() => {
    if (router.query.slug) {
      const farmObj = filteredFarms.find((x) => `${x.id}` === router.query.slug);
      if (farmObj) {
        selectFarm(farmObj);
      }
    }
  }, [router.query, filteredFarms]);

  useEffect(() => {
    let totalValueLocked = 0;

    for (let i = 0; i < filteredFarms.length; i++) {
      totalValueLocked += parseFloat(filteredFarms[i].totalValueLocked);
    }

    content[0].value = totalValueLocked.toString();
  }, [filteredFarms]);

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
          value={search}
          onChange={(event:any) => setSearch(event.target.value)}
        />
        <div className={s.switcherWrap}>
          <Switcher
            isActive
            onChange={() => {}}
            className={s.switcherInput}
          />
          <div className={s.switcher}>
            {t('common|Staked Only')}
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
      {filteredFarms.map((x) => (
        <FarmingCard
          key={x.id}
          farm={x}
          openModal={() => setModalOpen(true)}
        />
      ))}
    </>
  );
};
