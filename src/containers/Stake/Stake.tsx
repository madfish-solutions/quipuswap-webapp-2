import React, {
  useState, useContext, useMemo, useCallback, useEffect,
} from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useAccountPkh } from '@utils/dapp';
import { fromDecimals, sortFarms } from '@utils/helpers';
import { STABLE_TOKEN } from '@utils/defaults';
import { WhitelistedStake } from '@utils/types';
import { useMergedStakesInfo } from '@hooks/useMergedStakesInfo';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { SelectUI } from '@components/ui/Select';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { StakeInfo } from '@components/stake/StakeInfo';
// import { StakeCard } from '@components/stake/StakeCard';
import { ApyModal } from '@components/modals/ApyModal';
import { SliderUI } from '@components/ui/Slider';
import { FarmCardLoader } from '@components/farming/FarmingCard/FarmCardLoader/FarmCardLoader';
import Search from '@icons/Search.svg';

import s from './Stake.module.sass';

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

// const getAllHarvest = async ({
//   accountPkh,
//   farmContract,
//   handleErrorToast,
//   farmId,
// }: SubmitType) => {
//   try {
//     const farmParams = farmContract.methods
//       .harvest(farmId, accountPkh)
//       .toTransferParams(fromOpOpts(undefined, undefined));
//     return farmParams;
//   } catch (e) {
//     handleErrorToast(e);
//     return undefined;
//   }
// };

export const Stake: React.FC<StakeProps> = () => {
  const router = useRouter();
  const { t } = useTranslation(['common']);
  const accountPkh = useAccountPkh();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { mergedStakes, isStakesLoaded } = useMergedStakesInfo();
  const [selectedStake, selectStake] = useState<WhitelistedStake>();
  const [search, setSearch] = useState('');
  const [isSwitcherActive, setIsSwitcherActive] = useState(false);
  const [sort, setSort] = useState('Sorted By');
  const [modalOpen, setModalOpen] = useState<WhitelistedStake>();

  const sortedStakes = useMemo(() => sortFarms(sort, mergedStakes ?? []), [sort, mergedStakes]);

  const filteredStakes = useMemo(() => sortedStakes.filter((farm) => ((
    farm.tokenPair.token1.metadata.name.toLowerCase().includes(search.toLowerCase())
  ) || (
    farm.tokenPair.token2?.metadata.name.toLowerCase().includes(search.toLowerCase())
  ))), [search, sortedStakes]);

  const switchedStakes = useMemo(() => filteredStakes.filter((stake) => (
    isSwitcherActive
      ? stake.deposit.gt(0)
      : stake
  )), [filteredStakes, isSwitcherActive]);

  useEffect(() => {
    let totalValueLocked:BigNumber = new BigNumber(0);
    let totalDailyReward:BigNumber = new BigNumber(0);
    let totalPendingReward:BigNumber = new BigNumber(0);
    let totalClaimedReward:BigNumber = new BigNumber(0);
    let farmingLifetime:number;

    const countSecondsInDay = 24 * 60 * 60;

    for (let i = 0; i < switchedStakes.length; i++) {
      totalValueLocked = totalValueLocked.plus(new BigNumber(switchedStakes[i].totalValueLocked));
      totalDailyReward = totalDailyReward.plus(new BigNumber(switchedStakes[i].rewardPerSecond));
      totalClaimedReward = totalClaimedReward.plus(new BigNumber(switchedStakes[i].claimed));

      farmingLifetime = Date.now() - new Date(switchedStakes[i].startTime).getTime();
      totalPendingReward = totalPendingReward.plus(
        new BigNumber(farmingLifetime)
          .multipliedBy(new BigNumber(switchedStakes[i].rewardPerSecond))
          .minus(new BigNumber(switchedStakes[i].claimed)),
      );
    }

    totalDailyReward = totalDailyReward.multipliedBy(countSecondsInDay);

    content[0].value = fromDecimals(totalValueLocked, 6).toString();
    content[1].value = fromDecimals(totalDailyReward, 18).toString();
    content[2].value = fromDecimals(totalPendingReward, 18).toString();
    content[3].value = fromDecimals(totalClaimedReward, 6).toString();
  }, [switchedStakes]);

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

  // const handleChangeSort = useCallback(({ value, label }) => {
  //   const selectedSort = SortContent.find((sorting) => (
  //     sorting.id === value && sorting.label === label
  //   ));
  //   if (!selectedSort) return;
  //   setSort(selectedSort.id);
  // }, []);

  useEffect(() => {
    if (router.query.slug) {
      const stakeObj = filteredStakes.find((x) => `${x.farmId}` === router.query.slug);
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
  return (
    <>
      <ApyModal
        isOpen={!!modalOpen}
        close={() => setModalOpen(undefined)}
        apr={modalOpen?.apr}
        apyDaily={modalOpen?.apyDaily}
      />
      <Card
        className={cx(modeClass[colorThemeMode], s.farmingCard, s.desktop)}
        contentClassName={cx(s.farmingStats)}
      >
        {content.map((x) => (
          <div key={x.name} className={s.farmingStatsBlock}>
            <div className={s.name}>{x.name}</div>
            <CurrencyAmount
              amount={x.value}
              currency={x.currency}
              labelSize="large"
            />
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
      {/* <FarmingStats className={cx(s.farmingCard, s.farmingContent)} /> */}
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

      {isStakesLoaded ? (
        switchedStakes.map(() => (
          <div key={Math.random()}>
            {`StakeCard
            tezPrice={tezPrice}
            key={farm.farmId}
            farm={farm}
            openModal={() => setModalOpen(farm)}`}
          </div>
        ))) : (
          <>
            <FarmCardLoader />
            <FarmCardLoader />
            <FarmCardLoader />
          </>
      )}
    </>
  );
};
