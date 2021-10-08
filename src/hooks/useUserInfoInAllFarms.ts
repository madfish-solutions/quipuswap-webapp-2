import { useEffect, useState } from 'react';
import { FarmingUsersInfo } from '@utils/types';
import { useAccountPkh, useFarmingStorage } from '@utils/dapp';
import { useFarms } from './useFarms';

export const useUserInfoInAllFarms = () => {
  const farms = useFarms();
  const farmingStorage = useFarmingStorage();

  const accountPkh = useAccountPkh();
  const [userInfoInFarms, setUserInfoInFarms] = useState<FarmingUsersInfo[]>();

  useEffect(() => {
    const loadAmountOfTokensInFarms = async () => {
      if (!farms) return;
      if (!farmingStorage) return;

      const usersInfo:(
        Promise<FarmingUsersInfo | undefined> | undefined
      )[] = farms.map((farm) => (
        farmingStorage?.storage.users_info.get([
          +farm.fid,
          accountPkh,
        ])));

      const resolvedUserInfo = await Promise.all(usersInfo);
      if (resolvedUserInfo) {
        const resultUserInfo:any = {};

        for (let i = 0; i < farms.length; i++) {
          resultUserInfo[farms[i].fid] = resolvedUserInfo[i];
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
