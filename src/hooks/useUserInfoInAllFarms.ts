import { useEffect, useState } from 'react';
import { FarmingUsersInfo } from '@utils/types';
import { useAccountPkh, useFarmingStorage, useFarms } from '@utils/dapp';

export const useUserInfoInAllFarms = () => {
  const { data: farms } = useFarms();
  const farmingStorage = useFarmingStorage();
  const accountPkh = useAccountPkh();
  const [userInfoInFarms, setUserInfoInFarms] = useState<{
    [key:number]: FarmingUsersInfo | undefined
  }>();

  useEffect(() => {
    const loadAmountOfTokensInFarms = async () => {
      if (!farms) return;
      if (!farmingStorage) return;

      const usersInfo:(
        Promise<FarmingUsersInfo | undefined> | undefined
      )[] = farms.map((farm) => (
        farmingStorage.storage.users_info.get([
          +farm.farmId,
          accountPkh,
        ])));

      const resolvedUserInfo = await Promise.all(usersInfo);

      if (resolvedUserInfo) {
        const resultUserInfo:{ [key:number]: FarmingUsersInfo | undefined } = {};

        for (let i = 0; i < farms.length; i++) {
          resultUserInfo[+farms[i].farmId] = resolvedUserInfo[i];
        }

        setUserInfoInFarms(resultUserInfo);
      }
    };
    if (accountPkh) {
      loadAmountOfTokensInFarms();
    } else {
      setUserInfoInFarms(undefined);
    }
  }, [farms, accountPkh, farmingStorage]);

  return userInfoInFarms;
};
