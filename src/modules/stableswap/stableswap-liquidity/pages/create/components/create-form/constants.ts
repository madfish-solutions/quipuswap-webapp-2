import { i18n } from '@translation';

export const MIN_QUANTITY_OF_TOKENS_IN_STABLEPOOL = 2;
export const MAX_QUANTITY_OF_TOKENS_IN_STABLEPOOL = 4;
export const LOWER_LIQUIDITY_PRODIFDERS_FEE = {
  value: 0,
  isInclusive: true
};
export const UPPER_LIQUIDITY_PRODIFDERS_FEE = {
  value: 1,
  isInclusive: true
};

export const AMPLIFICATION_FIELD_NAME = 'amplification';
export const LIQUIDITY_PRODIFDERS_FEE_FIELD_NAME = 'liquidityProvidersFee';
export const TOKEN_KEY = 'tokens';

export const createPoolAmplification = [
  {
    radioName: AMPLIFICATION_FIELD_NAME,
    value: '10',
    label: i18n.t('stableswap|amplification10')
  },
  {
    radioName: AMPLIFICATION_FIELD_NAME,
    value: '100',
    label: i18n.t('stableswap|amplification100')
  },
  {
    radioName: AMPLIFICATION_FIELD_NAME,
    value: '200',
    label: i18n.t('stableswap|amplification200')
  }
];
