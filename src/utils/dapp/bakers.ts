import {
  BAKERS_API, BAKERS_API_TESTNET,
} from '@utils/defaults';
import { QSMainNet } from '@utils/types';
import BigNumber from 'bignumber.js';

export const getBakers = async (network: QSMainNet) => fetch(network === 'mainnet' ? BAKERS_API : BAKERS_API_TESTNET)
  .then((res) => res.json())
  .then((json) => (network === 'mainnet' ? json : json.map((x:any) => ({
    name: x.alias,
    address: x.address,
    logo: null,
    votes: x.stakingBalance,
    fee: 0.3,
    freeSpace: new BigNumber(100),
  }))))
  .catch(() => ([]));
