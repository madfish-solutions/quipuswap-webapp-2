import { NetworkType } from '@airgap/beacon-sdk';

import { SupportedNetworks, WhitelistedBaker } from '@shared/types';

import { NETWORK_ID } from './enviroment';

export const ITHACANET_BAKERS: WhitelistedBaker[] = [
  {
    address: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    logo: 'https://services.tzkt.io/v1/avatars/tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9'
  },
  {
    address: 'tz1MeT8NACB8Q4uV9dPQ3YxXBmYgapbxQxQ5',
    logo: 'https://services.tzkt.io/v1/avatars/tz1MeT8NACB8Q4uV9dPQ3YxXBmYgapbxQxQ5'
  },
  {
    address: 'tz1cg5EqC3WdZgRSvGJeW328S4KQNrT4jvyv',
    logo: 'https://services.tzkt.io/v1/avatars/tz1cg5EqC3WdZgRSvGJeW328S4KQNrT4jvyv'
  },
  {
    address: 'tz1NiaviJwtMbpEcNqSP6neeoBYj8Brb3QPv',
    logo: 'https://services.tzkt.io/v1/avatars/tz1NiaviJwtMbpEcNqSP6neeoBYj8Brb3QPv'
  },
  {
    address: 'tz1RJ74UepJA9tigjoEeUEFajowzVB3QQaVx',
    logo: 'https://services.tzkt.io/v1/avatars/tz1RJ74UepJA9tigjoEeUEFajowzVB3QQaVx'
  },
  {
    address: 'tz1iZ9LkpAhN8X1L6RpBtfy3wxpEWzFrXz8j',
    logo: 'https://services.tzkt.io/v1/avatars/tz1iZ9LkpAhN8X1L6RpBtfy3wxpEWzFrXz8j'
  },
  {
    address: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    logo: 'https://services.tzkt.io/v1/avatars/tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE'
  },
  {
    address: 'tz1VoSM93UoY5gjuvb1bHdwdJZzU4P5eEAs4',
    logo: 'https://services.tzkt.io/v1/avatars/tz1VoSM93UoY5gjuvb1bHdwdJZzU4P5eEAs4'
  },
  {
    address: 'tz1dqPQn5HXNJ7yjcqBx2w6sozjPXTV1kpfh',
    logo: 'https://services.tzkt.io/v1/avatars/tz1dqPQn5HXNJ7yjcqBx2w6sozjPXTV1kpfh'
  },
  {
    address: 'tz1KkJtLB9pMdLKNpVRNZw9zmysrxKmYcRGU',
    logo: 'https://services.tzkt.io/v1/avatars/tz1KkJtLB9pMdLKNpVRNZw9zmysrxKmYcRGU'
  }
];

const dummyBakers: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: 'tz1aRoaRhSpRYvFdyvgWLL6TGyRoGF51wDjM',
  [NetworkType.ITHACANET]: ITHACANET_BAKERS[0].address
};

export const DUMMY_BAKER = dummyBakers[NETWORK_ID];
