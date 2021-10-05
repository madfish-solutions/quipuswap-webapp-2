import { useEffect, useState } from 'react';
import { FarmingUsersInfo } from '@utils/types';
import { useAccountPkh, useAllFarms, useFarmingContract } from '@utils/dapp';

export const useUserInfoInAllFarms = () => {
  const allFarms = useAllFarms();
  const farmingContract = useFarmingContract();
  const accountPkh = useAccountPkh();
  const [userInfoInFarms, setUserInfoInFarms] = useState<FarmingUsersInfo[]>();

  useEffect(() => {
    const loadAmountOfTokensInFarms = async () => {
      if (!allFarms) return;
      if (!farmingContract) return;

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
      setUserInfoInFarms(undefined);
    }
  }, [allFarms, accountPkh, farmingContract]);

  return userInfoInFarms;
};
