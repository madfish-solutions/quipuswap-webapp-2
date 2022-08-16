import { isNull } from '@shared/helpers';

export const getMinEndTime = (farmItemEndTime: string, userEndTime: Nullable<number>) => {
  if (isNull(userEndTime)) {
    return null;
  }

  const preparedUserEndTime = new Date(userEndTime).getTime();
  const preparedFarmItemEndtime = new Date(farmItemEndTime).getTime();

  return Math.min(preparedFarmItemEndtime, preparedUserEndTime);
};
