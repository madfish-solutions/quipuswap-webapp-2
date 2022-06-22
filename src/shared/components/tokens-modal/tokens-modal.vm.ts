import { ChangeEvent } from 'react';

import { FormikErrors, useFormik } from 'formik';
import { noop } from 'rxjs';
import { number as numberSchema, object as objectSchema, string as stringSchema } from 'yup';

import { DEFAULT_TOKEN_ID, MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { useAddCustomToken } from '@providers/dapp-tokens';
import { clamp, getTokenSlug, isEmptyArray, toNonNegativeIntString } from '@shared/helpers';
import { useTokensSearch } from '@shared/hooks/use-tokens-search';
import { amplitudeService } from '@shared/services';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import { FormValues, TMFormField, TokensModalProps } from './types';

const FALLBACK_BLACKLISTED_TOKENS: Token[] = [];

const INITIAL_VALUES = {
  [TMFormField.SEARCH]: '',
  [TMFormField.TOKEN_ID]: ''
};
const VALIDATION_SCHEMA = objectSchema().shape({
  [TMFormField.SEARCH]: stringSchema().required(),
  [TMFormField.TOKEN_ID]: numberSchema().optional()
});
const ALL_FORM_FIELDS = [TMFormField.SEARCH, TMFormField.TOKEN_ID];

export const useTokensModalViewModel = ({
  onChange,
  blackListedTokens = FALLBACK_BLACKLISTED_TOKENS
}: Pick<TokensModalProps, 'onChange' | 'blackListedTokens'>) => {
  const searchFormik = useFormik<Partial<FormValues>>({
    validationSchema: VALIDATION_SCHEMA,
    initialValues: INITIAL_VALUES,
    onSubmit: noop,
    validateOnChange: true
  });
  const {
    values: { [TMFormField.SEARCH]: searchValue, [TMFormField.TOKEN_ID]: tokenId }
  } = searchFormik;
  const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);

  const { searchTokens, isSoleFa2Token, allTokens, isTokensNotFound, isTokensLoading } = useTokensSearch(
    blackListedTokens,
    searchValue,
    tokenId ? Number(tokenId) : undefined
  );

  const handleTokenSelect = (token: Token) => {
    onChange(token);
    if (!isEmptyArray(searchTokens)) {
      addCustomToken(token);
      amplitudeService.logEvent('SELECT_TOKEN', { token: getTokenSlug(token), customToken: true });
    } else {
      amplitudeService.logEvent('SELECT_TOKEN', { token: getTokenSlug(token), customToken: false });
    }
    searchFormik.resetForm();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === TMFormField.TOKEN_ID && value) {
      const normalizedStr = toNonNegativeIntString(value);

      searchFormik.setFieldValue(name, clamp(Number(normalizedStr), MIN_TOKEN_ID, MAX_TOKEN_ID));
    } else {
      searchFormik.setFieldValue(name, value);
    }
  };

  const handleTokenIdDecrement = async () =>
    searchFormik.setFieldValue(
      TMFormField.TOKEN_ID,
      Math.max(MIN_TOKEN_ID, Number(tokenId ?? DEFAULT_TOKEN_ID) - STEP)
    );

  const handleTokenIdIncrement = async () =>
    searchFormik.setFieldValue(
      TMFormField.TOKEN_ID,
      Math.min(MAX_TOKEN_ID, Number(tokenId ?? DEFAULT_TOKEN_ID) + STEP)
    );

  const errors = ALL_FORM_FIELDS.reduce<FormikErrors<Partial<FormValues>>>(
    (errorsPart, fieldName) => ({
      ...errorsPart,
      [fieldName]: searchFormik.touched[fieldName] ? searchFormik.errors[fieldName] : undefined
    }),
    {}
  );

  return {
    allTokens,
    errors,
    handleChange,
    handleTokenIdDecrement,
    handleTokenIdIncrement,
    handleTokenSelect,
    isSoleFa2Token,
    isTokensLoading,
    isTokensNotFound,
    modalTitle: t('common|Search token'),
    notFoundLabel: t('common|No tokens found'),
    values: searchFormik.values
  };
};
