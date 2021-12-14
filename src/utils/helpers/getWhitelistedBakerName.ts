import { isFullBaker, WhitelistedBaker } from '@utils/types';
import { shortize } from './shortize';

export const getWhitelistedBakerName = (
  baker: WhitelistedBaker,
  sliceAmount: number = 10,
) : string => {
  if (isFullBaker(baker)) {
    return baker.name.length > sliceAmount + 2
      ? `${baker.name.slice(0, sliceAmount)}...`
      : baker.name;
  }
  return shortize(baker.address);
};
