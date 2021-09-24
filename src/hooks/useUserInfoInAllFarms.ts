import { useEffect, useState } from 'react';
import { FarmingUsersInfo } from '@utils/types';
import { useAccountPkh, useFarmingContract } from '@utils/dapp';
import { useFarms } from '@hooks/useFarms';

export const useUserInfoInAllFarms = () => {
  const allFarms = useFarms();
  const farmingContract = useFarmingContract();
  const accountPkh = useAccountPkh();
  const [userInfoInFarms, setUserInfoInFarms] = useState<FarmingUsersInfo[]>();

  useEffect(() => {
    const loadAmountOfTokensInFarms = async () => {
      const usersInfo:(
        Promise<FarmingUsersInfo | undefined> | undefined
      )[] = allFarms.map((currentFarm) => (
        farmingContract?.storage.users_info.get([
          currentFarm.id,
          accountPkh,
        ])));

      const resolvedUserInfo = await Promise.all(usersInfo);
      if (resolvedUserInfo) {
        const resultUserInfo:any = {};

        for (let i = 0; i < allFarms.length; i++) {
          resultUserInfo[allFarms[i].id] = resolvedUserInfo[i];
        }
        setUserInfoInFarms(resultUserInfo);
      }
    };
    if (accountPkh) {
      loadAmountOfTokensInFarms();
    } else {
      setUserInfoInFarms([]);
    }
  }, [allFarms, accountPkh, farmingContract]);

  return userInfoInFarms;
};
