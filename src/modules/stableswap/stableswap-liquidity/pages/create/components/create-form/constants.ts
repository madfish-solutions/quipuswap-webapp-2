import { i18n } from '@translation';

export const MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL = 2;
export const MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL = 4;
//TODO: validate numbers
export const LOWER_LIQUIDITY_PRODIFDERS_FEE = {
  value: 0.01,
  isInclusive: true
};
export const UPPER_LIQUIDITY_PRODIFDERS_FEE = {
  value: 5,
  isInclusive: true
};

export const RADIO_BUTTON_NAME = 'amplification';
export const LIQUIDITY_PRODIFDERS_FEE = 'liquidityProvidersFee';
export const TOKEN_KEY = 'tokens';

export const radioButtonValues = [
  {
    radioName: RADIO_BUTTON_NAME,
    value: '10',
    label: i18n.t('stableswap|amplification10')
  },
  {
    radioName: RADIO_BUTTON_NAME,
    value: '100',
    label: i18n.t('stableswap|amplification100')
  },
  {
    radioName: RADIO_BUTTON_NAME,
    value: '200',
    label: i18n.t('stableswap|amplification200')
  }
];

//TODO: get actual values
export const creationCost = {
  burned: '20',
  devFee: '1200',
  total: '1220'
};
