import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  Plus,
  Modal,
  Button,
  ColorModes,
  TokenNotFound,
  LoadingTokenCell,
  ColorThemeContext,
} from '@quipuswap/ui-kit';
import { Field, FormSpy, withTypes } from 'react-final-form';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import {
  useTezos,
  useTokens,
  getTokenType,
  useNetwork,
  useSearchTokens,
  useAddCustomToken,
  useSearchCustomTokens,
} from '@utils/dapp';
import {
  isTokenEqual,
  localSearchToken,
  WhitelistedOrCustomToken,
} from '@utils/helpers';

import { FormApi } from 'final-form';
import s from './PositionsModal.module.sass';
import { FormValues, PositionsModalProps } from './PositionsModal.types';
import { Header } from './PositionModalHeader';
import { PositionTokenCell } from './PositionTokenCell';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const AutoSave = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const PositionsModal: React.FC<PositionsModalProps> = ({
  onChange,
  onRequestClose,
  notSelectable1 = undefined,
  notSelectable2 = undefined,
  initialPair,
  ...props
}) => {
  const addCustomToken = useAddCustomToken();
  const searchCustomToken = useSearchCustomTokens();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const tezos = useTezos();
  const { Form } = withTypes<FormValues>();
  const { data: tokens } = useTokens();
  const network = useNetwork();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();
  const [filteredTokens, setFilteredTokens] = useState<WhitelistedToken[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputToken, setInputToken] = useState<string>('');
  const [isSoleFa2Token, setSoleFa2Token] = useState<boolean>(false);

  const handleInput = (values: FormValues) => {
    setInputValue(values.search ?? '');
    setInputToken(isSoleFa2Token ? values.tokenId : '');
  };

  const handleTokenSearch = useCallback(() => {
    const isTokens = tokens.filter((token: WhitelistedToken) => localSearchToken(
      token as WhitelistedOrCustomToken,
      network,
      inputValue,
      +inputToken,
    ));
    setFilteredTokens(isTokens);
    if (inputValue.length > 0 && isTokens.length === 0) {
      searchCustomToken(inputValue, +inputToken);
    }
  }, [inputToken, inputValue, network, tokens, searchCustomToken]);

  const isEmptyTokens = useMemo(
    () => filteredTokens.length === 0 && searchTokens.length === 0,
    [searchTokens, filteredTokens],
  );

  useEffect(
    () => handleTokenSearch(),
    [tokens, inputValue, inputToken, handleTokenSearch],
  );

  const allTokens = useMemo(
    () => (inputValue.length > 0 && filteredTokens.length === 0
      ? searchTokens
      : filteredTokens),
    [inputValue, filteredTokens, searchTokens],
  );

  useEffect(() => {
    getTokenType(inputValue, tezos!)
      .then((tokenType) => setSoleFa2Token(tokenType === 'fa2'))
      .catch(console.error);
  }, [inputValue, tezos]);

  const handleTokenA = (
    token: WhitelistedToken,
    form: FormApi<FormValues, Partial<FormValues>>,
    values: FormValues,
  ) => {
    if (!notSelectable1) {
      if (values.token2 && values.token1) {
        form.mutators.setValue('token1', values.token2);
        form.mutators.setValue('token2', undefined);
      } else if (!values.token1) {
        form.mutators.setValue('token1', token);
      } else {
        form.mutators.setValue('token1', undefined);
      }
    }
  };

  const handleTokenB = (
    token: WhitelistedToken,
    form: FormApi<FormValues, Partial<FormValues>>,
    values: FormValues,
  ) => {
    if (!notSelectable2) {
      if (!values.token2) {
        form.mutators.setValue('token2', token);
      } else {
        form.mutators.setValue('token2', undefined);
      }
    }
  };

  const handleTokenListItem = (
    token: WhitelistedToken,
    form: FormApi<FormValues, Partial<FormValues>>,
    values: FormValues,
  ) => {
    if (searchTokens.length > 0) {
      addCustomToken(token);
    }
    if (!values.token1) {
      form.mutators.setValue('token1', token);
    } else if (!values.token2) {
      form.mutators.setValue('token2', token);
    }
    form.mutators.setValue('search', '');
    form.mutators.setValue('tokenId', '');
    setInputValue('');
    setInputToken('');
  };

  return (
    <Form
      onSubmit={handleInput}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      initialValues={{
        token1: initialPair?.token1,
        token2: initialPair?.token2,
      }}
      render={({ form, values }) => (
        <Modal
          title={t('common|Your Positions')}
          header={(
            <AutoSave
              form={form}
              debounce={1000}
              save={handleInput}
              isSecondInput={isSoleFa2Token}
            />
          )}
          footer={(
            <Button
              onClick={() => onChange({
                token1: values.token1,
                token2: values.token2,
              } as WhitelistedTokenPair)}
              disabled={!values.token2 || !values.token1}
              className={s.modalButton}
              theme="primary"
            >
              Select
            </Button>
          )}
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          onRequestClose={(e) => {
            if (values.token1 && values.token2) {
              onChange({
                token1: values.token1,
                token2: values.token2,
              } as WhitelistedTokenPair);
            }
            if (onRequestClose) onRequestClose(e);
          }}
          {...props}
        >
          <Field name="token1" initialValue={notSelectable1}>
            {({ input }) => {
              const token = input.value;
              if (!token) return '';
              return (
                <PositionTokenCell
                  token={token}
                  onClick={() => handleTokenA(token, form, values)}
                  isChecked
                />
              );
            }}
          </Field>
          {values.token1 && (
            <div className={s.listItem}>
              <Plus className={s.iconButton} />
              <div className={s.listText}>Search another Token</div>
            </div>
          )}
          <Field initialValue={notSelectable2} name="token2">
            {({ input }) => {
              const token = input.value;
              if (!token) return '';
              return (
                <PositionTokenCell
                  token={token}
                  onClick={() => handleTokenB(token, form, values)}
                  isChecked
                />
              );
            }}
          </Field>
          {isEmptyTokens && !searchLoading && (
            <div className={s.tokenNotFound}>
              <TokenNotFound />
              <div className={s.notFoundLabel}>
                {t('common|No tokens found')}
              </div>
            </div>
          )}
          {isEmptyTokens
            && searchLoading
            && [1, 2, 3, 4, 5, 6].map((x) => <LoadingTokenCell key={x} />)}
          {!values.token2
            && allTokens
              .filter((x) => !values.token1 || !isTokenEqual(x, values.token1))
              .map((token) => {
                const { contractAddress, fa2TokenId } = token;
                return (
                  <PositionTokenCell
                    key={`${contractAddress}_${fa2TokenId ?? 0}`}
                    token={token}
                    onClick={() => handleTokenListItem(token, form, values)}
                    isChecked={false}
                  />
                );
              })}
        </Modal>
      )}
    />
  );
};
