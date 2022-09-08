/* eslint-disable @typescript-eslint/no-magic-numbers */
import { NetworkType } from '@airgap/beacon-sdk';
import { BigNumber } from 'bignumber.js';

import { SupportedNetworks } from '@shared/types';

import { FARMING_API_URL, NETWORK_ID, LIQUIDITY_API_URL, STABLESWAP_API_URL } from './environment';

//#region time
export const MS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MS_IN_MINUTES = MS_IN_SECOND * SECONDS_IN_MINUTE;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_YEAR = 365;
export const SECONDS_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
//#endregion

//#region debounce time
export const DEBOUNCE_MS = 200;
export const AUTOSAVE_DEBOUNCE_MS = MS_IN_SECOND;
//#endregion

//#region liveable rewards time
export const FARM_REWARD_UPDATE_INTERVAL = MS_IN_SECOND;
export const FARM_USER_INFO_UPDATE_INTERVAL = 30 * MS_IN_SECOND;
//#endregion

//#region numberInput
export const MIN_TOKEN_ID = 0;
export const MAX_TOKEN_ID = Number.MAX_SAFE_INTEGER;
export const STEP = 1;
//#endregion

//#region settings
const MAX_DEADLINE_DAYS = 30;

export const MIN_DEADLINE_MINS = 1;
export const MAX_DEADLINE_MINS = MAX_DEADLINE_DAYS * HOURS_IN_DAY * MINUTES_IN_HOUR;

export const MIN_SLIPPAGE_PERCENTAGE = 0;
export const MAX_SLIPPAGE_PERCENTAGE = 30;

export const DEFAULT_LIQUIDITY_SLIPPAGE_PERCENTAGE = 0;
export const DEFAULT_TRADING_SLIPPAGE_PERCENTAGE = 0.1;
export const DEFAULT_DEADLINE_MINS = 30;
//#endregion

//#region tokens
export const DEFAULT_DECIMALS = 6;
export const LP_TOKEN_DECIMALS = 6;
export const STABLESWAP_LP_DECIMALS = 18;
//#endregion

//#region strings
export const EMPTY_STRING = '';
export const ZERO_LENGTH = 0;
export const LP_INPUT_KEY = 'lp-input';
//#endregion

//#region arrays
export const FISRT_INDEX = 0;
//#endregion

//#region default value for token search
export const DEFAULT_TOKEN_ID = 0;
export const DEFAULT_SEARCH_VALUE = '';
//#endregion

//#region signs
export const DOLLAR = '$';
export const PERCENT = '%';
export const SLASH = '/';
export const EPPROXIMATILY_SIGN = '~';
export const EPPROXIMATILY_EQUAL_SIGN = '≈';
//#endregion

//#region sort
export const SWAP = 1;
export const SKIP = -1;
//#endregion

//#region API
export const LIST = 'list';
export const NEW_LIST = 'new-list';
export const STATS = 'stats';
// TODO: change api address => change farm => dividends (if needed)
export const DIVIDENDS = 'farm';

export const FARMING_LIST_API_URL = `${FARMING_API_URL}/${LIST}`;
export const FARMING_LIST_API_URL_V2 = `${FARMING_API_URL}/v2/${LIST}`;
export const FARMING_NEW_LIST_API_URL = `${FARMING_API_URL}/${NEW_LIST}`;
export const FARMING_STATS_API_URL = `${FARMING_API_URL}/${STATS}`;

export const STABLESWAP_LIST_API_URL = `${STABLESWAP_API_URL}/${LIST}`;
export const STABLESWAP_STATS_API_URL = `${STABLESWAP_API_URL}/${STATS}`;
export const STABLEDIVIDENDS_LIST_API_URL = `${STABLESWAP_API_URL}/${DIVIDENDS}/${LIST}`;
export const STABLEDIVIDENDS_STATS_API_URL = `${STABLESWAP_API_URL}/${DIVIDENDS}/${STATS}`;

export const LIQUIDITY_LIST_API_URL = `${LIQUIDITY_API_URL}/${LIST}`;
export const LIQUIDITY_STATS_API_URL = `${LIQUIDITY_API_URL}/${STATS}`;
//#endregion

//TODO: assort mix
//#region mix
export const FIRST_TUPLE_INDEX = 0;
export const SECOND_TUPLE_INDEX = 1;

export const MOCK_LOADING_ARRAY = [1, 2, 3, 4, 5, 6];
export const TAB_INDEX = 0;

export const ZERO_ADDRESS = 'tz1ZZZZZZZZZZZZZZZZZZZZZZZZZZZZNkiRg';
export const ZERO_AMOUNT = 0;

export const USD_DECIMALS = 2;

export const MAX_ITEMS_PER_PAGE = 5;
export const MAX_HOPS_COUNT = 3;

export const NO_WITHDRAWAL_FEE_VALUE = 0;

export const NO_TIMELOCK_VALUE = '0';

export const TEZ_TO_LEAVE = new BigNumber('0.1');
export const TEZ_TRANSFER_AMOUNT_CAP = new BigNumber('0.01');

export const PRESET_AMOUNT_INPUT_DECIMALS = 2;
export const MINIMUM_PRESET_AMOUNT_INPUT_VALUE = 0;

export const DELAY_BEFORE_DATA_UPDATE = 3000;

export const EMPTY_POOL_AMOUNT = 0;

export const FIRST_TWO_DIGITS_NUMBER = 10;

const FARM_ID_FOR_RESTAKE_MAP: Record<SupportedNetworks, number> = {
  [NetworkType.MAINNET]: 3,
  [NetworkType.GHOSTNET]: 8
};

export const FARM_ID_FOR_RESTAKE = FARM_ID_FOR_RESTAKE_MAP[NETWORK_ID];

const PERCENTAGE = 100;
export const PERCENTAGE_100 = new BigNumber(PERCENTAGE);

export const DEFAULT_BAKER_FOR_NON_TEZ_LP = null;
export const DEFAULT_STABLESWAP_POOL_ID = 0;

export const STABLESWAP_DIVIDENDS_ACCUM_PRECISION = 10_000_000_000;

export const FARMING_FEES_PERCENTAGE_PRECISION = 16;
//#endregion

// error constant
export const SERVER_UNAVAILABLE_MESSAGE = 'The server is temporarily unavailable.';
export const SERVER_UNAVAILABLE_ERROR_MESSAGE = '503 Service Temporarily Unavailable';

// PRECISIONS
export const CONTRACT_DECIMALS_PRECISION = 1e18;
export const TOKEN_DECIMALS_PRECISION = 1e6;
export const PRECISION_PERCENT = 1e2;
export const STABLESWAP_PRECISION_FEE = 1e10;

//#region default stableswap fee
export const CONTRACT_DECIMALS_PRECISION_POWER = 18; // 1e18
const DEFAULT_STABLESWAP_INTERFACE_FEE = 0.005;
const DEFAULT_STABLESWAP_STAKERS_FEE = 0.03;

export const DEFAULT_STABLESWAP_INTERFACE_FEE_WITH_PRECISION = new BigNumber(DEFAULT_STABLESWAP_INTERFACE_FEE)
  .multipliedBy(STABLESWAP_PRECISION_FEE)
  .div(PERCENTAGE);
export const DEFAULT_STABLESWAP_STAKERS_FEE_WITH_PRECISION = new BigNumber(DEFAULT_STABLESWAP_STAKERS_FEE)
  .multipliedBy(STABLESWAP_PRECISION_FEE)
  .div(PERCENTAGE);
//#endregion

//TESTNET
export const TESTNET_EXCHANGE_RATE = 1.5;

//Charts
export const COLORS = ['#1373E4', '#2ED33E', '#F9A605', '#FF8042'];

// Baker
export const ZERO_BAKER_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

// Choose token
export const SINGLE_TOKEN_VALUE = 1;
