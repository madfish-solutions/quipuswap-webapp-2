import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { FARM_CONTRACT, STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import {
  FarmingContractInfo, FarmingUsersInfo,
  WhitelistedFarm,
  WhitelistedTokenPair,
} from '@utils/types';
import { prettyPrice } from '@utils/helpers';
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
  useTezos,
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
  const accountPkh = useAccountPkh();
  const [totalFarms, setTotalFarms] = useState<WhitelistedFarm[]>([]);
  const [contract, setContract] = useState<FarmingContractInfo>();
  const [userInfo, setUserInfo] = useState<FarmingUsersInfo[]>();
  const [allFarms, setAllFarms] = useState<WhitelistedFarm[]>([]);

  const mergeUserAndFarmsInfo = (
    userInfoArr: FarmingUsersInfo[] | undefined,
    totalFarmsArr: WhitelistedFarm[],
  ):WhitelistedFarm[] => {
    if (userInfoArr) {
      const mergedInfo:WhitelistedFarm[] = [];

      for (let i = 0; i < totalFarmsArr.length; i++) {
        if (totalFarmsArr[i].id === userInfoArr[i]?.farmId) {
          mergedInfo.push({
            ...totalFarmsArr[i],
            deposit: userInfoArr[i].staked,
            earned: userInfoArr[i].earned,
          });
        }
      }

      return mergedInfo;
    }

    return totalFarmsArr;
  };

  useEffect(() => {
    const start = async () => {
      const loadFarms = async () => {
        if (!tezos) return;
        if (!network) return;
        const contractInfo = await getStorageInfo(tezos, FARM_CONTRACT);
        setContract(contractInfo);
        const possibleFarms = new Array(+contractInfo?.storage.farms_count.toString())
          .fill(0)
          .map(async (x, id) => (contractInfo?.storage.farms.get(id)));
        const tempFarms = await Promise.all(possibleFarms);
        if (tempFarms) {
          const totalFarmsWrapper = tempFarms
            .filter((x) => !!x)
            .map((x, id) => ({
              id,
              tokenPair: fallbackPair,
              totalValueLocked: prettyPrice(x.staked),
              apy: '888%',
              daily: '0.008%',
              balance: '1000000.00',
              multiplier: '888',
              tokenContract: '#',
              farmContract: '#',
              projectLink: '#',
              analyticsLink: '#',
              remaining: new Date(Date.now() + 48 * 3600000),
            }));
          setTotalFarms(totalFarmsWrapper);
        }
      };
      await loadFarms();

      console.log('contract', contract);
      console.log('totalFarms', totalFarms);

      const loadUserInfo = async () => {
        const usersInfoArray = totalFarms.map(
          (farm): Promise<FarmingUsersInfo | undefined> | undefined => (
            contract?.storage.users_info.get([farm.id, accountPkh])
          ),
        );
        const resolvedUserInfo = await Promise.all(usersInfoArray);
        const userInFarms:FarmingUsersInfo[] = [];
        for (let i = 0; i < totalFarms.length; i++) {
          userInFarms.push({ ...resolvedUserInfo[i], farmId: totalFarms[i].id });
        }
        setUserInfo(userInFarms);
      };

      if (accountPkh && contract) {
        await loadUserInfo();
      }

      console.log('userInfo', userInfo);

      setAllFarms(mergeUserAndFarmsInfo(userInfo, totalFarms));
    };
    start();
  }, [accountPkh, tezos, network]);

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
      {allFarms.map((x) => (
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
