import { BigNumber } from 'bignumber.js';

/* eslint-disable @typescript-eslint/no-magic-numbers */
export const DEFAULT_TOKEN_ID = 0;
export const DEFAULT_SEARCH_VALUE = '';
export const MOCK_LOADING_ARRAY = [1, 2, 3, 4, 5, 6];

export const DEBOUNCE_MS = 200;

export const MIN_TOKEN_ID = 0;
export const MAX_TOKEN_ID = Number.MAX_SAFE_INTEGER;
export const STEP = 1;

export const AUTOSAVE_DEBOUNCE_MS = 1000;

export const TAB_INDEX = 0;

export const ZERO_ADDRESS = 'tz1ZZZZZZZZZZZZZZZZZZZZZZZZZZZZNkiRg';
export const FARM_REWARD_UPDATE_INTERVAL = 1000;
export const FARM_USER_INFO_UPDATE_INTERVAL = 30000;
export const MS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const SECONDS_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
export const MAX_SLIPPAGE_PERCENTAGE = 30;
export const DEFAULT_SLIPPAGE_PERCENTAGE = 0.5;
export const DEFAULT_DEADLINE_MINS = 30;
const MAX_DEADLINE_DAYS = 30;
export const DAYS_IN_YEAR = 365;
export const USD_DECIMALS = 2;
export const MAX_DEADLINE_MINS = MAX_DEADLINE_DAYS * HOURS_IN_DAY * MINUTES_IN_HOUR;
export const MIN_DEADLINE_MINS = 1;
export const MAX_ITEMS_PER_PAGE = 5;
export const MAX_HOPS_COUNT = 5;

export const NO_TIMELOCK_VALUE = '0';

export const TEZ_TO_LEAVE = new BigNumber('0.1');
export const TEZ_TRANSFER_AMOUNT_CAP = new BigNumber('0.01');

export const PRESET_AMOUNT_INPUT_DECIMALS = 2;
export const MINIMUM_PRESET_AMOUNT_INPUT_VALUE = 0;

export const DELAY_BEFORE_DATA_UPDATE = 3000;

export const DEFAULT_DECIMALS = 6;

export const LP_TOKEN_DECIMALS = 6;

export const EMPTY_POOL_AMOUNT = 0;

export const FIRST_TWO_DIGITS_NUMBER = 10;
