import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';

/* eslint-disable @typescript-eslint/no-magic-numbers */
const ticks = [
  {
    id: new BigNumber(-1048575),
    fee_growth_outside: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    liquidity_net: new BigNumber(202000),
    n_positions: new BigNumber(2),
    next: new BigNumber(0),
    prev: new BigNumber(-1048576),
    seconds_outside: new BigNumber(0),
    seconds_per_liquidity_outside: new BigNumber(0),
    sqrt_price: new BigNumber('20'),
    tick_cumulative_outside: new BigNumber(0)
  },
  {
    id: new BigNumber(0),
    fee_growth_outside: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    liquidity_net: new BigNumber(99798000),
    n_positions: new BigNumber(2),
    next: new BigNumber(1),
    prev: new BigNumber(-1048575),
    seconds_outside: new BigNumber(28435),
    seconds_per_liquidity_outside: new BigNumber('3659782944600756487450418904128883034392509'),
    sqrt_price: new BigNumber('1208925819614629174706176'),
    tick_cumulative_outside: new BigNumber(0)
  },
  {
    id: new BigNumber(1),
    fee_growth_outside: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    liquidity_net: new BigNumber(-80000000),
    n_positions: new BigNumber(2),
    next: new BigNumber(2),
    prev: new BigNumber(0),
    seconds_outside: new BigNumber(0),
    seconds_per_liquidity_outside: new BigNumber(0),
    sqrt_price: new BigNumber('1208986267416792366952600'),
    tick_cumulative_outside: new BigNumber(0)
  },
  {
    id: new BigNumber(2),
    fee_growth_outside: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    liquidity_net: new BigNumber(-20000000),
    n_positions: new BigNumber(1),
    next: new BigNumber(1048575),
    prev: new BigNumber(1),
    seconds_outside: new BigNumber(0),
    seconds_per_liquidity_outside: new BigNumber(0),
    sqrt_price: new BigNumber('1209046718241421228370686'),
    tick_cumulative_outside: new BigNumber(0)
  },
  {
    id: new BigNumber(1048575),
    fee_growth_outside: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    liquidity_net: new BigNumber(0),
    n_positions: new BigNumber(1),
    next: new BigNumber(1048576),
    prev: new BigNumber(2),
    seconds_outside: new BigNumber(0),
    seconds_per_liquidity_outside: new BigNumber(0),
    sqrt_price: new BigNumber('71107673757466966990985103421469892397199512717'),
    tick_cumulative_outside: new BigNumber(0)
  }
];

export const mockPositions = [
  {
    id: new BigNumber(0),
    fee_growth_inside_last: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    lower_tick: ticks[1],
    upper_tick: ticks[2],
    owner: 'tz1LSMu9PugfVyfX2ynNU9y4eVvSACJKP7sg',
    liquidity: new BigNumber(100000000)
  },
  {
    id: new BigNumber(1),
    fee_growth_inside_last: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    lower_tick: ticks[2],
    upper_tick: ticks[3],
    owner: 'tz1LSMu9PugfVyfX2ynNU9y4eVvSACJKP7sg',
    liquidity: new BigNumber(20000000)
  },
  {
    id: new BigNumber(2),
    fee_growth_inside_last: {
      x: ZERO_AMOUNT_BN,
      y: ZERO_AMOUNT_BN
    },
    lower_tick: ticks[0],
    upper_tick: ticks[1],
    owner: 'tz1LSMu9PugfVyfX2ynNU9y4eVvSACJKP7sg',
    liquidity: new BigNumber(202000)
  }
];
