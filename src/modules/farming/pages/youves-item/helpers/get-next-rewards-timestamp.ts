import { MS_IN_HOUR } from '@config/constants';

export const getNextRewardsTimestamp = () => {
  const dateNow = Date.now();
  const prevRewardsDate = dateNow - (dateNow % MS_IN_HOUR);

  return prevRewardsDate + MS_IN_HOUR;
};
