import { WhitelistedFarmOptional } from '@utils/types';

export const sortFarms = (sort:string, farms:WhitelistedFarmOptional[]) => {
  let sortingParam: keyof WhitelistedFarmOptional;

  switch (sort) {
    case 'asc:tvl':
      sortingParam = 'totalValueLocked';
      break;
    case 'asc:apy':
      sortingParam = 'apy';
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
