import { useContext } from 'react';

import { FormApi } from 'final-form';
import { withTypes } from 'react-final-form';

import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID } from '@config/constants';
import { ColorThemeContext } from '@providers/color-theme-context';
import { useAddCustomToken } from '@providers/dapp-tokens';
import { useTranslation } from '@translation';

import { isEmptyArray, isTokenEqual } from '../../helpers';
import { useTokensSearchService } from '../../services';
import { Token } from '../../types';
import { FormValues, IPositionsModalProps, PMFormField } from './PositionsModal.types';

export const usePositionsModalViewModel = ({
  onChange,
  onRequestClose,
  notSelectable1 = undefined,
  notSelectable2 = undefined,
  blackListedTokens = [],
  initialPair
}: IPositionsModalProps) => {
  const addCustomToken = useAddCustomToken();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();

  const { handleInput, isSoleFa2Token, allTokens, searchTokens, isTokensNotFound, isTokensLoading, resetSearchValues } =
    useTokensSearchService<FormValues>(blackListedTokens);

  const handleTokenA = (token: Token, form: FormApi<FormValues, Partial<FormValues>>, values: FormValues) => {
    if (!notSelectable1) {
      if (values[PMFormField.SECOND_TOKEN] && values[PMFormField.FIRST_TOKEN]) {
        form.mutators.setValue(PMFormField.FIRST_TOKEN, values[PMFormField.SECOND_TOKEN]);
        form.mutators.setValue(PMFormField.SECOND_TOKEN, undefined);
      } else if (!values[PMFormField.FIRST_TOKEN]) {
        form.mutators.setValue(PMFormField.FIRST_TOKEN, token);
      } else {
        form.mutators.setValue(PMFormField.FIRST_TOKEN, undefined);
      }
    }
  };

  const handleTokenB = (token: Token, form: FormApi<FormValues, Partial<FormValues>>, values: FormValues) => {
    if (!notSelectable2) {
      if (!values[PMFormField.SECOND_TOKEN]) {
        form.mutators.setValue(PMFormField.SECOND_TOKEN, token);
      } else {
        form.mutators.setValue(PMFormField.SECOND_TOKEN, undefined);
      }
    }
  };

  const handleTokenListItem = (token: Token, form: FormApi<FormValues, Partial<FormValues>>, values: FormValues) => {
    if (!isEmptyArray(searchTokens)) {
      addCustomToken(token);
    }
    if (!values[PMFormField.FIRST_TOKEN]) {
      form.mutators.setValue(PMFormField.FIRST_TOKEN, token);
    } else if (!values[PMFormField.SECOND_TOKEN]) {
      form.mutators.setValue(PMFormField.SECOND_TOKEN, token);
    }
    form.mutators.setValue(PMFormField.SEARCH, DEFAULT_SEARCH_VALUE);
    form.mutators.setValue(PMFormField.TOKEN_ID, DEFAULT_TOKEN_ID);
    resetSearchValues();
  };

  const handleSelect = (values: FormValues) => {
    onChange({
      token1: values[PMFormField.FIRST_TOKEN],
      token2: values[PMFormField.SECOND_TOKEN]
    });
  };

  const checkFirstTokenSame = (values: FormValues) =>
    initialPair?.token1 &&
    values[PMFormField.FIRST_TOKEN] &&
    isTokenEqual(values[PMFormField.FIRST_TOKEN], initialPair.token1);
  const checkSecondTokenSame = (values: FormValues) =>
    initialPair?.token2 &&
    values[PMFormField.SECOND_TOKEN] &&
    isTokenEqual(values[PMFormField.SECOND_TOKEN], initialPair.token2);

  const isSelectDisabled = (values: FormValues) => {
    const isFirstTokenSameOrDontChoosen = checkFirstTokenSame(values);
    const isSecondTokenSameOrDontChoosen = checkSecondTokenSame(values);

    return isFirstTokenSameOrDontChoosen && isSecondTokenSameOrDontChoosen;
  };

  const shouldSubmitOnRequest = (values: FormValues) => {
    const isFirstTokenSame = checkFirstTokenSame(values);
    const isSecondTokenSame = checkSecondTokenSame(values);

    return (
      values[PMFormField.FIRST_TOKEN] && values[PMFormField.SECOND_TOKEN] && (!isFirstTokenSame || !isSecondTokenSame)
    );
  };

  return {
    allTokens,
    colorThemeMode,
    handleInput,
    handleSelect,
    handleTokenA,
    handleTokenB,
    handleTokenListItem,
    initialPair,
    isSelectDisabled,
    isSoleFa2Token,
    isTokensLoading,
    isTokensNotFound,
    notSelectable1,
    notSelectable2,
    onRequestClose,
    shouldSubmitOnRequest,
    t,
    Form
  };
};
