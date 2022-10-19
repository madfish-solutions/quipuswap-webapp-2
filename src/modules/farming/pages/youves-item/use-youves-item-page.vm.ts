import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { FISRT_INDEX } from '@config/constants';
import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useGetYouvesFarmingItem } from '@modules/farming/hooks/loaders/use-get-youves-farming-item';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { defined, getTokensNames, isEmptyArray, isNull, isUndefined } from '@shared/helpers';
import { useToken } from '@shared/hooks';
import { Token } from '@shared/types';

import { TabProps } from './components/youves-tabs/tab-props.interface';

const getTitle = (tokens: Token[]): string => `Farming ${isEmptyArray(tokens) ? getTokensNames(tokens) : '...'}`;
const DEFAULT_TOKENS: Token[] = [];
const FALLBACK_STAKE_ID = new BigNumber(0);

export const useYouvesItemPageViewModel = (): { title: string } & TabProps => {
  const accountPkh = useAccountPkh();
  const dAppReady = useReady();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { contractAddress } = useParams();

  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { getFarmingItem } = useGetYouvesFarmingItem();

  const item = farmingYouvesItemStore.item;
  const tokens = item?.tokens ?? DEFAULT_TOKENS;
  const stakedToken = useToken(item?.stakedToken ?? null);
  const stakedTokenBalance = farmingYouvesItemStore.availableBalance;
  const stakes = farmingYouvesItemStore.userInfo.stakes;

  const title = getTitle(tokens);

  useEffect(() => {
    if ((!dAppReady || isUndefined(contractAddress)) && prevAccountPkhRef.current === accountPkh) {
      return;
    }

    void getFarmingItem(contractAddress);
    prevAccountPkhRef.current = accountPkh;
  }, [getFarmingItem, dAppReady, contractAddress, accountPkh]);

  useEffect(() => {
    if (isNull(farmingYouvesItemStore)) {
      return;
    }

    farmingYouvesItemStore.makePendingRewardsLiveable();

    return () => farmingYouvesItemStore.clearIntervals();
  }, [farmingYouvesItemStore]);

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('item', item);
  }, [item]);

  useEffect(() => {
    console.log('availableBalance', stakedTokenBalance?.toFixed());
  }, [stakedTokenBalance]);

  useEffect(() => {
    console.log('userInfo', farmingYouvesItemStore.userInfo);
  }, [farmingYouvesItemStore.userInfo]);

  useEffect(() => {
    console.log('currentTab', farmingYouvesItemStore.currentTab);
  }, [farmingYouvesItemStore.currentTab]);

  useEffect(() => {
    console.log('inputAmount', farmingYouvesItemStore.inputAmount?.toFixed());
  }, [farmingYouvesItemStore.inputAmount]);

  useEffect(() => {
    console.log('rewards', {
      claimableRewards: farmingYouvesItemStore.claimableRewards?.toFixed(),
      longTermRewards: farmingYouvesItemStore.longTermRewards?.toFixed()
    });
  }, [farmingYouvesItemStore.claimableRewards, farmingYouvesItemStore.longTermRewards]);
  /* eslint-enable no-console */

  return {
    title,
    contractAddress: defined(contractAddress, 'Contract Address'),
    stakes,
    // TODO: Next Epic
    stakeId: stakes?.[FISRT_INDEX]?.id ?? FALLBACK_STAKE_ID,
    lpToken: stakedToken,
    userLpTokenBalance: stakedTokenBalance,
    tokens
  };
};
