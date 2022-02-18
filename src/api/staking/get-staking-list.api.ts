import { STALKING_API_URL } from '@app.config';
import { RawStakeItem } from '@interfaces/staking.interfaces';
import { Nullable } from '@utils/types';

const STALKING_LIST_API_URL = `${STALKING_API_URL}/list`;

export const getStakingListApi = async (accountPkh: Nullable<string>) => {
  // TODO
  // eslint-disable-next-line no-console
  console.log('get staking list with accountPkh', accountPkh);
  const res = await fetch(STALKING_LIST_API_URL);

  return (await res.json()) as RawStakeItem[];
};
