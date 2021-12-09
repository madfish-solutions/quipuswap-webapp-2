import { WhitelistedBaker } from '@utils/types';
import { shortize } from './shortize';

export const getWhitelistedBakerName = (
  baker:WhitelistedBaker,
  sliceAmount: number = 10,
) : string => (
  baker.name && baker?.name.length > sliceAmount + 2
    ? `${baker.name.slice(0, sliceAmount)}...`
    : baker.name
) ?? shortize(baker.address)
  ?? 'Baker';
