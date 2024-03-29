import { isExist } from '@shared/helpers';
import { isFullBaker, WhitelistedBaker, WhitelistedBakerFull } from '@shared/types';

export const isBakerNotEmpty = (baker: WhitelistedBaker): baker is WhitelistedBakerFull =>
  isFullBaker(baker) && isExist(baker.name) && isExist(baker.freeSpace);
