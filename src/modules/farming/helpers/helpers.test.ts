/* eslint-disable no-console */
import BigNumber from 'bignumber.js';

import { FarmingItem, UsersInfoValue } from '../interfaces';
import { getUserPendingReward } from './helpers';

const usersInfoValue = {
  staked: new BigNumber(1000),
  earned: new BigNumber(1000),
  prev_earned: new BigNumber(150)
};

const farmingItem = {
  rewardPerSecond: new BigNumber(30),
  rewardPerShare: new BigNumber(20),
  staked: new BigNumber(100),
  udp: '2022-04-21T09:56:00.000Z',
  endTime: '2022-07-10T09:05:00.000Z'
};

const usersInfoValueDisabled = {
  staked: new BigNumber(100),
  earned: new BigNumber(100),
  prev_earned: new BigNumber(15)
};

const farmingItemDisabled = {
  rewardPerSecond: new BigNumber(3),
  rewardPerShare: new BigNumber(2),
  staked: new BigNumber(10),
  udp: '2022-04-21T09:56:00.000Z',
  endTime: '2022-04-20T09:05:00.000Z'
};

const timestamp = 1654761716082;

console.log('active', +getUserPendingReward(usersInfoValue as UsersInfoValue, farmingItem as FarmingItem, timestamp));
console.log(
  'disabled',
  +getUserPendingReward(usersInfoValueDisabled as UsersInfoValue, farmingItemDisabled as FarmingItem, timestamp)
);

// describe('getUserPendingReward', () => {
//   test('should return correct value for today', () => {
//     expect(getUserPendingReward(usersInfoValue as UsersInfoValue, farmingItem as FarmingItem, timestamp)).toBe(1);
//   });
// });
