import React, {
  useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import {
  useAddCustomToken,
  useSearchCustomTokens,
  useSearchTokens,
  useTezos,
  useTokens,
  isTokenFa2,
  useNetwork,
} from '@utils/dapp';
import { localSearchToken, isTokensEqual } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { validateMinMax } from '@utils/validators';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Checkbox } from '@components/ui/Checkbox';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { LoadingTokenCell, TokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import { NumberInput } from '@components/ui/NumberInput';
import { Plus } from '@components/svg/Plus';
import Search from '@icons/Search.svg';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './PositionsModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type PositionsModalProps = {
  onChange: (tokenPair: WhitelistedTokenPair) => void
} & ReactModal.Props;

type HeaderProps = {
  isSecondInput:boolean,
  debounce:number,
  save:any,
  values:any,
  form:any,
};

type FormValues = {
  search: string
  tokenId: string
  token1: WhitelistedToken
  token2: WhitelistedToken
};

const Header:React.FC<HeaderProps> = ({
  isSecondInput, debounce, save, values, form,
}) => {
  const { t } = useTranslation(['common']);

  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [values]);

  return (
    <div className={s.inputs}>
      <Field
        name="search"
      >
        {({ input, meta }) => (
          <>
            <Input
              {...input}
              StartAdornment={Search}
              className={s.modalInput}
              placeholder={t('common:Search')}
              error={meta.error}
              readOnly={values.token1 && values.token2}
            />
          </>
        )}

      </Field>
      {(isSecondInput) && (
      <Field
        name="tokenId"
        validate={validateMinMax(0, 100)}
      >
        {({ input, meta }) => (
          <>
            <NumberInput
              {...input}
              className={s.modalInput}
              placeholder={t('common:Token ID')}
              step={1}
              min={0}
              max={100}
              readOnly={values.token1 && values.token2}
              error={(meta.touched && meta.error) || meta.submitError}
              onIncrementClick={() => {
                form.mutators.setValue(
                  'tokenId',
                  +input.value + 1 > 100 ? 100 : +input.value + 1,
                );
              }}
              onDecrementClick={() => {
                form.mutators.setValue(
                  'tokenId',
                  +input.value - 1 < 1 ? 1 : +input.value - 1,
                );
              }}
            />
          </>
        )}
      </Field>
      )}
    </div>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const PositionsModal: React.FC<PositionsModalProps> = ({
  onChange,
  onRequestClose,
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

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
    setInputToken(isSoleFa2Token ? values.tokenId : '');
  };

  const handleTokenSearch = () => {
    const isTokens = tokens
      .filter(
        (token:any) => localSearchToken(
          token,
          network,
          inputValue,
          +inputToken,
        ),
      );
    setFilteredTokens(isTokens);
    if (inputValue.length > 0 && isTokens.length === 0) {
      searchCustomToken(inputValue, +inputToken);
    }
  };

  const isEmptyTokens = useMemo(
    () => filteredTokens.length === 0
    && searchTokens.length === 0,
    [searchTokens, filteredTokens],
  );

  useEffect(() => handleTokenSearch(), [tokens, inputValue, inputToken]);

  const allTokens = useMemo(() => (inputValue.length > 0 && filteredTokens.length === 0
    ? searchTokens : filteredTokens), [inputValue, filteredTokens, searchTokens]);

  useEffect(() => {
    const getFa2 = async () => {
      const res = await isTokenFa2(inputValue, tezos!!);
      setSoleFa2Token(res);
    };
    getFa2();
  }, [inputValue, tezos]);

  return (
    <Form
      onSubmit={handleInput}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      render={({ form, values }) => (
        <Modal
          title={t('common:Your Positions')}
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
              onClick={() => onChange({ token1: values.token1, token2: values.token2, dex: '' })}
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
              onChange({ token1: values.token1, token2: values.token2, dex: '' });
            }
            if (onRequestClose) onRequestClose(e);
          }}
          {...props}
        >
          <Field name="token1">
            {({ input }) => {
              const token = input.value;
              if (!token) return '';
              return (
                <TokenCell
                  token={token}
                  tabIndex={0}
                  onClick={() => {
                  // onChange(token);
                    if (values.token2 && values.token1) {
                      form.mutators.setValue('token1', values.token2);
                      form.mutators.setValue('token2', undefined);
                    } else if (!values.token1) {
                      form.mutators.setValue('token1', token);
                    } else {
                      form.mutators.setValue('token1', undefined);
                    }
                  }}
                >
                  <Checkbox checked />
                </TokenCell>
              );
            }}
          </Field>
          {values.token1 && (
          <div className={s.listItem}>
            <Plus className={s.iconButton} />
            <div className={s.listText}>
              Search another Token
            </div>
          </div>
          )}
          <Field name="token2">
            {({ input }) => {
              const token = input.value;
              if (!token) return '';
              return (
                <TokenCell
                  token={token}
                  tabIndex={0}
                  onClick={() => {
                    if (!values.token2) {
                      form.mutators.setValue('token2', token);
                    } else {
                      form.mutators.setValue('token2', undefined);
                    }
                  }}
                >
                  <Checkbox checked />
                </TokenCell>
              );
            }}
          </Field>
          {isEmptyTokens && !searchLoading && (
            <div className={s.tokenNotFound}>
              <TokenNotFound />
              <div className={s.notFoundLabel}>{t('common:No tokens found')}</div>
            </div>
          )}
          {isEmptyTokens && searchLoading && (
            [1, 2, 3, 4, 5, 6, 7].map((x) => (<LoadingTokenCell key={x} />))
          )}
          {!values.token2 && allTokens
            .filter((x) => !values.token1 || !isTokensEqual(x, values.token1))
            .map((token) => {
              const {
                contractAddress, fa2TokenId,
              } = token;
              return (
                <TokenCell
                  key={`${contractAddress}_${fa2TokenId ?? 0}`}
                  token={token}
                  tabIndex={0}
                  onClick={() => {
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
                  }}
                >
                  <Checkbox checked={false} />
                </TokenCell>
              );
            })}
        </Modal>

      )}
    />
  );
};
