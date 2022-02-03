import React, { useContext, FC } from 'react';

import { Plus, Modal, ColorModes, TokenNotFound, LoadingTokenCell, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';
import ReactModal from 'react-modal';

import { Button } from '@components/ui/elements/button';
import { useAddCustomToken } from '@utils/dapp';
import { isTokenEqual } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { DEFAULT_SEARCH_VALUE, DEFAULT_TOKEN_ID, MOCK_LOADING_ARRAY } from '../constants';
import { useTokensSearchService } from '../use-tokens-search.service';
import { Header } from './PositionModalHeader';
import s from './PositionsModal.module.sass';
import { FormValues, IPositionsModalProps, PositionsModalFormField } from './PositionsModal.types';
import { PositionTokenCell } from './PositionTokenCell';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

// eslint-disable-next-line
const AutoSave = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={Header} />;

export const PositionsModal: FC<IPositionsModalProps & ReactModal.Props> = ({
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

  const handleTokenA = (
    token: WhitelistedToken,
    form: FormApi<FormValues, Partial<FormValues>>,
    values: FormValues
  ) => {
    if (!notSelectable1) {
      if (values[PositionsModalFormField.SECOND_TOKEN] && values[PositionsModalFormField.FIRST_TOKEN]) {
        form.mutators.setValue(PositionsModalFormField.FIRST_TOKEN, values[PositionsModalFormField.SECOND_TOKEN]);
        form.mutators.setValue(PositionsModalFormField.SECOND_TOKEN, undefined);
      } else if (!values[PositionsModalFormField.FIRST_TOKEN]) {
        form.mutators.setValue(PositionsModalFormField.FIRST_TOKEN, token);
      } else {
        form.mutators.setValue(PositionsModalFormField.FIRST_TOKEN, undefined);
      }
    }
  };

  const handleTokenB = (
    token: WhitelistedToken,
    form: FormApi<FormValues, Partial<FormValues>>,
    values: FormValues
  ) => {
    if (!notSelectable2) {
      if (!values[PositionsModalFormField.SECOND_TOKEN]) {
        form.mutators.setValue(PositionsModalFormField.SECOND_TOKEN, token);
      } else {
        form.mutators.setValue(PositionsModalFormField.SECOND_TOKEN, undefined);
      }
    }
  };

  const handleTokenListItem = (
    token: WhitelistedToken,
    form: FormApi<FormValues, Partial<FormValues>>,
    values: FormValues
  ) => {
    if (searchTokens.length > 0) {
      addCustomToken(token);
    }
    if (!values[PositionsModalFormField.FIRST_TOKEN]) {
      form.mutators.setValue(PositionsModalFormField.FIRST_TOKEN, token);
    } else if (!values[PositionsModalFormField.SECOND_TOKEN]) {
      form.mutators.setValue(PositionsModalFormField.SECOND_TOKEN, token);
    }
    form.mutators.setValue(PositionsModalFormField.SEARCH, DEFAULT_SEARCH_VALUE);
    form.mutators.setValue(PositionsModalFormField.TOKEN_ID, DEFAULT_TOKEN_ID);
    resetSearchValues();
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
        [PositionsModalFormField.FIRST_TOKEN]: initialPair?.token1,
        [PositionsModalFormField.SECOND_TOKEN]: initialPair?.token2
      }}
      render={
        //eslint-disable-next-line sonarjs/cognitive-complexity
        ({ form, values }) => (
          <Modal
            title={t('common|Your Positions')}
            header={<AutoSave form={form} debounce={200} save={handleInput} isSecondInput={isSoleFa2Token} />}
            footer={
              <Button
                onClick={() =>
                  onChange({
                    token1: values[PositionsModalFormField.FIRST_TOKEN],
                    token2: values[PositionsModalFormField.SECOND_TOKEN]
                  } as WhitelistedTokenPair)
                }
                disabled={!values[PositionsModalFormField.SECOND_TOKEN] || !values[PositionsModalFormField.FIRST_TOKEN]}
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
              if (values[PositionsModalFormField.FIRST_TOKEN] && values[PositionsModalFormField.SECOND_TOKEN]) {
                onChange({
                  token1: values[PositionsModalFormField.FIRST_TOKEN],
                  token2: values[PositionsModalFormField.SECOND_TOKEN]
                } as WhitelistedTokenPair);
              }
              if (onRequestClose) {
                onRequestClose(e);
              }
            }}
            {...props}
          >
            <Field name={PositionsModalFormField.FIRST_TOKEN} initialValue={notSelectable1}>
              {({ input }) => {
                const token = input.value;
                if (!token) {
                  return '';
                }

                return <PositionTokenCell token={token} onClick={() => handleTokenA(token, form, values)} isChecked />;
              }}
            </Field>
            {values[PositionsModalFormField.FIRST_TOKEN] && (
              <div className={s.listItem}>
                <Plus className={s.iconButton} />
                <div className={s.listText}>Search another Token</div>
              </div>
            )}
            <Field name={PositionsModalFormField.SECOND_TOKEN} initialValue={notSelectable2}>
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
            {!values[PositionsModalFormField.SECOND_TOKEN] &&
              allTokens
                .filter(
                  x =>
                    !values[PositionsModalFormField.FIRST_TOKEN] ||
                    !isTokenEqual(x, values[PositionsModalFormField.FIRST_TOKEN])
                )
                .map(token => {
                  const { contractAddress, fa2TokenId } = token;

                  return (
                    <PositionTokenCell
                      key={`${contractAddress}_${fa2TokenId ?? DEFAULT_TOKEN_ID}`}
                      token={token}
                      onClick={() => handleTokenListItem(token, form, values)}
                      isChecked={false}
                    />
                  );
                })}
          </Modal>
        )
      }
    />
  );
};
