import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  useAddCustomToken, useSearchCustomTokens, useSearchTokens, useTezos, useTokens,
} from '@utils/dapp';
import { parseNumber, localSearchToken } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { validateMinMax } from '@utils/validators';
import { MAINNET_NETWORK } from '@utils/defaults';
import { Modal } from '@components/ui/Modal';
import { TokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Pen } from '@components/svg/Pen';
import Search from '@icons/Search.svg';
// import TopArrow from '@icons/TopArrow.svg';
// import BotArrow from '@icons/BotArrow.svg';
import TokenNotFound from '@icons/TokenNotFound.svg';

import { NumberInput } from '@components/ui/NumberInput';
import { isTokenFa2 } from '@utils/dapp/tokens';
import s from './TokensModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type TokensModalProps = {
  onChange: (token: WhitelistedToken) => void
} & ReactModal.Props;

type HeaderProps = {
  isSecondInput:boolean
  debounce:number,
  save:any,
  values:any,
  form:any,
};

type FormValues = {
  search: string
  tokenId: number
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
            />
          </>
        )}

      </Field>
      {(isSecondInput) && (
      <Field
        name="tokenId"
        validate={validateMinMax(0, 100)}
        parse={(value) => parseNumber(value, 0, 100)}
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

type ModalLoaderProps = {
  isEmptyTokens:boolean
  searchLoading:boolean,
};

const ModalLoader: React.FC<ModalLoaderProps> = ({ isEmptyTokens, searchLoading }) => {
  const { t } = useTranslation(['common']);
  if (isEmptyTokens && !searchLoading) {
    return (
      <div className={s.tokenNotFound}>
        <TokenNotFound />
        <div className={s.notFoundLabel}>{t('common:No tokens found')}</div>
        {' '}
      </div>
    );
  } if (isEmptyTokens && searchLoading) {
    return (
      <div>
        {[1, 2, 3, 4, 5, 6, 7].map((x) => (
          <TokenCell
            key={x}
            loading
            token={{} as WhitelistedToken}
          />
        ))}
      </div>
    );
  }
  return null;
};

export const TokensModal: React.FC<TokensModalProps> = ({
  onChange,
  ...props
}) => {
  const addCustomToken = useAddCustomToken();
  const searchCustomToken = useSearchCustomTokens();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const tezos = useTezos();
  const { Form } = withTypes<FormValues>();
  const { data: tokens } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();
  const [filteredTokens, setFilteredTokens] = useState<WhitelistedToken[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputToken, setInputToken] = useState<number>(0);
  const [isSoleFa2Token, setSoleFa2Token] = useState<boolean>(false);

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
    setInputToken(isSoleFa2Token ? values.tokenId : 0);
  };

  const handleTokenSearch = () => {
    const isTokens = tokens
      .filter(
        (token) => localSearchToken(
          token,
          MAINNET_NETWORK,
          inputValue,
          inputToken,
        ),
      );
    setFilteredTokens(isTokens);
    if (inputValue.length > 0 && isTokens.length === 0) {
      searchCustomToken(inputValue, inputToken);
    }
  };

  const isEmptyTokens = filteredTokens.length === 0 && searchTokens.length === 0;

  useEffect(() => handleTokenSearch(), [tokens, inputValue, inputToken]);

  const allTokens = inputValue.length > 0 && filteredTokens.length === 0
    ? searchTokens : filteredTokens;

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
      render={({ form }) => (
        <Modal
          title={t('common:Search token')}
          header={(
            <AutoSave
              form={form}
              debounce={1000}
              save={handleInput}
              isSecondInput={isSoleFa2Token}
            />
          )}
          footer={(
            <Button className={s.modalButton} theme="inverse">
              Manage Lists
              <Pen className={s.penIcon} />

            </Button>
          )}
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          {...props}
        >
          <ModalLoader
            isEmptyTokens={isEmptyTokens}
            searchLoading={searchLoading}
          />
          {allTokens.map((token) => {
            const {
              contractAddress, fa2TokenId,
            } = token;
            return (
              <div
                aria-hidden
                key={`${contractAddress}_${fa2TokenId ?? 0}`}
                onClick={() => {
                  onChange(token);
                  if (searchTokens.length > 0) {
                    addCustomToken(token);
                  }
                  form.mutators.setValue('search', '');
                  form.mutators.setValue('tokenId', 0);
                  setInputValue('');
                  setInputToken(0);
                }}
              >
                <TokenCell
                  token={token}
                />
              </div>
            );
          })}
        </Modal>

      )}
    />
  );
};
