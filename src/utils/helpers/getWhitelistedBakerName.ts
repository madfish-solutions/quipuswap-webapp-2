import { Nullable, WhitelistedBaker } from '@utils/types';

import { isBackerNotEmpty } from './is-backer-not-empty';
import { isExist } from './isExist';
import { shortize } from './shortize';

export function getWhitelistedBakerName(baker: WhitelistedBaker, sliceAmount?: number, charsLength?: number): string;
export function getWhitelistedBakerName(
  baker: Nullable<WhitelistedBaker>,
  sliceAmount?: number,
  charsLength?: number
): Nullable<string>;

export function getWhitelistedBakerName(
  baker: WhitelistedBaker | Nullable<WhitelistedBaker>,
  sliceAmount = 10,
  charsLength = 5
): string | Nullable<string> {
  if (!isExist(baker)) {
    return null;
  }

  if (isBackerNotEmpty(baker)) {
    return baker.name.length > sliceAmount + 2 ? `${baker.name.slice(0, sliceAmount)}...` : baker.name;
  }

  return shortize(baker.address, charsLength);
}
