import constate from 'constate';

const useStakeData = () => {
  const statsData = [{}];
  const listData = [{}];

  return {
    statsData,
    listData
  };
};

export const [StakeDataProvider, useStakeStats, useStakeList] = constate(
  useStakeData,
  v => v.statsData,
  v => v.listData
);
