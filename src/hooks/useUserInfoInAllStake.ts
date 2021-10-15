import { useEffect, useState, useCallback } from 'react';
import { FarmingUsersInfo } from '@utils/types';
import {
  useAccountPkh, useFarmingStorage, useStakes,
} from '@utils/dapp';

export const useUserInfoInAllStake = () => {
  const { data: stakes } = useStakes();
  const farmingStorage = useFarmingStorage();
  const accountPkh = useAccountPkh();
  const [userInfoInStakes, setUserInfoInStakes] = useState<{
    [key:number]: FarmingUsersInfo | undefined
  }>();

  const loadAmountOfTokensInStakes = useCallback(async () => {
    if (!stakes) return;
    if (!farmingStorage) return;

    const usersInfo:(
      Promise<FarmingUsersInfo | undefined> | undefined
    )[] = stakes.map((farm) => (
      farmingStorage.storage.users_info.get([
        +farm.farmId,
        accountPkh,
      ])));

    const resolvedUserInfo = await Promise.all(usersInfo);

    if (resolvedUserInfo) {
      const resultUserInfo:{ [key:number]: FarmingUsersInfo | undefined } = {};

      for (let i = 0; i < stakes.length; i++) {
        resultUserInfo[+stakes[i].farmId] = resolvedUserInfo[i];
      }

      setUserInfoInStakes(resultUserInfo);
    }
  }, [stakes, accountPkh, farmingStorage]);

  useEffect(() => {
    if (accountPkh) {
      loadAmountOfTokensInStakes();
    } else {
      setUserInfoInStakes(undefined);
    }
  }, [stakes, accountPkh, farmingStorage, loadAmountOfTokensInStakes]);

  return { userInfoInStakes, loadAmountOfTokensInStakes };
};
