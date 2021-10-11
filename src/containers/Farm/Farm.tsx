import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';

import { useAccountPkh } from '@utils/dapp';
import { STABLE_TOKEN } from '@utils/defaults';
import { fromDecimals, prettyPrice, sortFarms } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedFarm } from '@utils/types';
import { useMergedFarmsInfo } from '@hooks/useMergedFarmsInfo';
import { useUserInfoInAllFarms } from '@hooks/useUserInfoInAllFarms';
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
  const accountPkh = useAccountPkh();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [selectedFarming, selectFarm] = useState<WhitelistedFarm>();
  const { t } = useTranslation(['common']);
  const [sort, setSort] = useState('Sorted By');
  const [search, setSearch] = useState('');
  const [isSwitcherActive, setIsSwitcherActive] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<BigNumber>();

  const sortedFarms = useMemo(() => sortFarms(sort, mergedFarms ?? []), [sort, mergedFarms]);

  const filteredFarms = useMemo(() => sortedFarms.filter((farm) => ((
    farm.tokenPair.token1.metadata.name.toLowerCase().includes(search.toLowerCase())
  ) || (
    farm.tokenPair.token2?.metadata.name.toLowerCase().includes(search.toLowerCase())
  ))), [search, sortedFarms]);

  const switchedFarms = useMemo(() => filteredFarms.filter((farm) => (
    isSwitcherActive
      ? parseInt(farm.deposit ?? '0', 10) > 0
      : farm
  )), [filteredFarms, isSwitcherActive]);

  useEffect(() => {
    if (router.query.slug) {
      const farmObj = filteredFarms.find((x) => `${x.farmId}` === router.query.slug);
      if (farmObj) {
        selectFarm(farmObj);
      }
    }
  }, [router.query, filteredFarms]);

  useEffect(() => {
    if (userInfoInAllFarms) {
      let earned:BigNumber = new BigNumber(0);

      for (let index = 0; index < Object.keys(userInfoInAllFarms).length; index++) {
        earned = earned.plus(userInfoInAllFarms[index].earned ?? 0);
      }

      setPending(earned);
    }
  }, [userInfoInAllFarms]);

  useEffect(() => {
    let totalValueLocked:BigNumber = new BigNumber(0);
    let totalDailyReward:BigNumber = new BigNumber(0);
    let totalPendingReward:BigNumber = new BigNumber(0);
    let totalClaimedReward:BigNumber = new BigNumber(0);
    let farmingLifetime:number;

    const countSecondsInDay = 24 * 60 * 60;

    for (let i = 0; i < filteredFarms.length; i++) {
      totalValueLocked = totalValueLocked.plus(new BigNumber(filteredFarms[i].totalValueLocked));
      totalDailyReward = totalDailyReward.plus(new BigNumber(filteredFarms[i].rewardPerSecond));
      totalClaimedReward = totalClaimedReward.plus(new BigNumber(filteredFarms[i].claimed));

      farmingLifetime = Date.now() - new Date(filteredFarms[i].startTime).getTime();
      totalPendingReward = totalPendingReward.plus(
        new BigNumber(farmingLifetime)
          .multipliedBy(new BigNumber(filteredFarms[i].rewardPerSecond))
          .minus(new BigNumber(filteredFarms[i].claimed)),
      );
    }

    totalDailyReward = totalDailyReward.multipliedBy(countSecondsInDay);

    content[0].value = fromDecimals(totalValueLocked, 6).toString();
    content[1].value = fromDecimals(totalDailyReward, 6).toString();
    content[2].value = fromDecimals(totalPendingReward, 6).toString();
    content[3].value = fromDecimals(totalClaimedReward, 6).toString();
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

  const handleChangeSwitcher = useCallback(() => setIsSwitcherActive(!isSwitcherActive),
    [isSwitcherActive]);

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
            <span className={s.currency}>
              {prettyPrice(+x.value)}
            </span>
            {x.currency && (
              <span>{x.currency}</span>
            )}
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
      <FarmingStats className={cx(s.farmingCard, s.farmingContent)} pending={pending} />
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
            isActive={isSwitcherActive}
            onChange={handleChangeSwitcher}
            className={s.switcherInput}
            disabled={!accountPkh}
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

      {switchedFarms.map((farm) => (
        <FarmingCard
          key={farm.farmId}
          farm={farm}
          openModal={() => setModalOpen(true)}
        />
      ))}
    </>
  );
};
