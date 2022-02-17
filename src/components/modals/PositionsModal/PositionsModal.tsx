import { useContext, FC } from 'react';

import { Plus, ColorModes, TokenNotFound, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';
import { Props } from 'react-modal';

import { LoadingTokenCell, Modal } from '@components/modals/Modal';
import { Button } from '@components/ui/elements/button';
import { RawToken } from '@interfaces/types';
import { useAddCustomToken } from '@utils/dapp';
import { isEmptyArray, isTokenEqual } from '@utils/helpers';

import { DEBOUNCE_MS, DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID, MOCK_LOADING_ARRAY } from '../constants';
import { getTokenKey } from '../get-token-key';
import { useTokensSearchService } from '../use-tokens-search.service';
import { Header } from './PositionModalHeader';
import s from './PositionsModal.module.sass';
import { FormValues, IPositionsModalProps, PMFormField } from './PositionsModal.types';
import { PositionTokenCell } from './PositionTokenCell';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

// eslint-disable-next-line
const AutoSave = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={Header} />;

export const PositionsModal: FC<IPositionsModalProps & Props> = ({
  onChange,
  onRequestClose,
  notSelectable1 = undefined,
  notSelectable2 = undefined,
  blackListedTokens = [],
  initialPair,
  ...props
}) => {
  const addCustomToken = useAddCustomToken();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();

  const { handleInput, isSoleFa2Token, allTokens, searchTokens, isTokensNotFound, isTokensLoading, resetSearchValues } =
    useTokensSearchService<FormValues>(blackListedTokens);

  const handleTokenA = (token: RawToken, form: FormApi<FormValues, Partial<FormValues>>, values: FormValues) => {
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

  const handleTokenB = (token: RawToken, form: FormApi<FormValues, Partial<FormValues>>, values: FormValues) => {
    if (!notSelectable2) {
      if (!values[PMFormField.SECOND_TOKEN]) {
        form.mutators.setValue(PMFormField.SECOND_TOKEN, token);
      } else {
        form.mutators.setValue(PMFormField.SECOND_TOKEN, undefined);
      }
    }
  };

  const handleTokenListItem = (token: RawToken, form: FormApi<FormValues, Partial<FormValues>>, values: FormValues) => {
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

  return (
    <Form
      onSubmit={handleInput}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        }
      }}
      initialValues={{
        [PMFormField.FIRST_TOKEN]: initialPair?.token1,
        [PMFormField.SECOND_TOKEN]: initialPair?.token2
      }}
      render={
        //eslint-disable-next-line sonarjs/cognitive-complexity
        ({ form, values }) => (
          <Modal
            title={t('common|Your Positions')}
            header={<AutoSave form={form} debounce={DEBOUNCE_MS} save={handleInput} isSecondInput={isSoleFa2Token} />}
            footer={
              <Button
                onClick={() => handleSelect(values)}
                disabled={isSelectDisabled(values)}
                className={s.modalButton}
                theme="primary"
              >
                Select
              </Button>
            }
            className={themeClass[colorThemeMode]}
            modalClassName={s.tokenModal}
            containerClassName={s.tokenModal}
            cardClassName={cx(s.tokenModal, s.maxHeight)}
            contentClassName={cx(s.tokenModal)}
            onRequestClose={e => {
              if (shouldSubmitOnRequest(values)) {
                handleSelect(values);
              }
              if (onRequestClose) {
                onRequestClose(e);
              }
            }}
            {...props}
          >
            <Field name={PMFormField.FIRST_TOKEN} initialValue={notSelectable1}>
              {({ input }) => {
                const token = input.value;
                if (!token) {
                  return '';
                }

                return <PositionTokenCell token={token} onClick={() => handleTokenA(token, form, values)} isChecked />;
              }}
            </Field>
            {values[PMFormField.FIRST_TOKEN] && (
              <div className={s.listItem}>
                <Plus className={s.iconButton} />
                <div className={s.listText}>Search another Token</div>
              </div>
            )}
            <Field name={PMFormField.SECOND_TOKEN} initialValue={notSelectable2}>
              {({ input }) => {
                const token = input.value;
                if (!token) {
                  return '';
                }

                return <PositionTokenCell token={token} onClick={() => handleTokenB(token, form, values)} isChecked />;
              }}
            </Field>
            {isTokensNotFound && (
              <div className={s.tokenNotFound}>
                <TokenNotFound />
                <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>
              </div>
            )}
            {isTokensLoading && MOCK_LOADING_ARRAY.map(x => <LoadingTokenCell key={x} />)}
            {!values[PMFormField.SECOND_TOKEN] &&
              allTokens
                .filter(
                  token => !values[PMFormField.FIRST_TOKEN] || !isTokenEqual(token, values[PMFormField.FIRST_TOKEN])
                )
                .map(token => (
                  <PositionTokenCell
                    key={getTokenKey(token)}
                    token={token}
                    onClick={() => handleTokenListItem(token, form, values)}
                    isChecked={false}
                  />
                ))}
          </Modal>
        )
      }
    />
  );
};
