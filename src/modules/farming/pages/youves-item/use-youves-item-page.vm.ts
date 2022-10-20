import { useEffect, useRef } from 'react';

import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';

import { FISRT_INDEX } from '@config/constants';
import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { useGetYouvesFarmingItem } from '@modules/farming/hooks/loaders/use-get-youves-farming-item';
import { useAccountPkh, useReady } from '@providers/use-dapp';
import { defined, getTokensNames, isEmptyArray, isNull, isUndefined } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import { TabProps } from './components/youves-tabs/tab-props.interface';

const DEFAULT_TOKENS: Token[] = [];
const FALLBACK_STAKE_ID = new BigNumber(0);

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useYouvesItemPageViewModel = (): { title: string } & TabProps => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();
  const dAppReady = useReady();
  const prevAccountPkhRef = useRef<Nullable<string>>(accountPkh);

  const { contractAddress } = useParams();

  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { getFarmingItem } = useGetYouvesFarmingItem();

  const item = farmingYouvesItemStore.item;
  const tokens = item?.tokens ?? DEFAULT_TOKENS;
  const stakedToken = useToken(item?.stakedToken ?? null);
  const stakedTokenBalance = useTokenBalance(stakedToken);
  const stakes = farmingYouvesItemStore.stakes;

  const title = t('farm|farmingTokens', { tokens: isEmptyArray(tokens) ? '...' : getTokensNames(tokens) });

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
    console.log('stakes', stakes);
  }, [stakes]);

  useEffect(() => {
    console.log('currentTab', farmingYouvesItemStore.currentTab);
  }, [farmingYouvesItemStore.currentTab]);

  useEffect(() => {
    console.log('rewards', {
      claimableRewards: farmingYouvesItemStore.claimableRewards?.toFixed(),
      longTermRewards: farmingYouvesItemStore.longTermRewards?.toFixed()
    });
  }, [farmingYouvesItemStore.claimableRewards, farmingYouvesItemStore.longTermRewards]);
  /* eslint-enable no-console */

  const stakeId = stakes?.[FISRT_INDEX]?.id ?? FALLBACK_STAKE_ID;

  return {
    title,
    contractAddress: defined(contractAddress, 'Contract Address'),
    stakes,
    stakeId,
    stakedToken,
    stakedTokenBalance,
    tokens
  };
};
