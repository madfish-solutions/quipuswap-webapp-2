import { WhitelistedFarm } from '@utils/types';

export const sortFarms = (sort:string, farms:WhitelistedFarm[]) => {
  let sortingParam: keyof WhitelistedFarm;

  switch (sort) {
    case 'asc:tvl':
      sortingParam = 'totalValueLocked';
      break;
    case 'asc:apy':
      sortingParam = 'apyDaily';
      break;
    case 'asc:deposit':
      sortingParam = 'deposit';
      break;
    default:
      return farms;
  }

  if (farms) {
    farms.sort((a, b) => {
      if ((a[sortingParam] ?? '') < (b[sortingParam] ?? '')) {
        return 1;
      }

      if ((a[sortingParam] ?? '') > (b[sortingParam] ?? '')) {
        return -1;
      }

      return 0;
    });
  }

  return [...farms];
};
