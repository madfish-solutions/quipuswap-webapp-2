import { Nullable, WhitelistedBaker } from '@shared/types';

import { shortize } from '../shortize';
import { isExist } from '../type-checks';
import { isBakerNotEmpty } from './is-baker-not-empty';

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

  if (isBakerNotEmpty(baker)) {
    return baker.name.length > sliceAmount + 2 ? `${baker.name.slice(0, sliceAmount)}...` : baker.name;
  }

  return shortize(baker.address, charsLength);
}
