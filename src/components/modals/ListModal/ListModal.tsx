import React, {
  useContext, useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import {
  // useSearchCustomTokens,
  // useSearchTokens,
  useTezos,
  // useTokens,
  useNetwork,
  useLists,
  useSearchLists,
  useSearchCustomLists,
} from '@utils/dapp';
// import { parseNumber, localSearchToken, localSearchList } from '@utils/helpers';
import { localSearchList } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenList } from '@utils/types';
// import { validateMinMax } from '@utils/validators';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
// import { ChooseListCell, LoadingTokenCell } from '@components/ui/Modal/ModalCell';
import { LoadingTokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
// import { NumberInput } from '@components/ui/NumberInput';
import Search from '@icons/Search.svg';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './ListModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type ListModalProps = {
  onChange: (token: WhitelistedToken) => void,
  blackListedTokens: WhitelistedToken[],
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
  debounce, save, values,
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
              placeholder={t('common|Search https:// or ipfs://')}
              error={meta.error}
            />
          </>
        )}

      </Field>
    </div>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const ListModal: React.FC<ListModalProps> = ({
  onChange,
  ...props
}) => {
  // const addCustomToken = useAddCustomToken();
  // const searchCustomToken = useSearchCustomTokens();
  const searchCustomList = useSearchCustomLists();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const tezos = useTezos();
  const network = useNetwork();
  const { Form } = withTypes<FormValues>();
  const { data: lists, loading: listsLoading } = useLists();
  const { data: searchTokens, loading: searchLoading } = useSearchLists();
  const [filteredTokens] = useState<WhitelistedToken[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
  };

  const handleTokenSearch = useCallback(() => {
    if (!network || !tezos) return;
    const isList = lists
      .filter(
        (list:WhitelistedTokenList) => localSearchList(
          list,
          inputValue,
        ),
      );
    if (inputValue.length > 0 && isList.length === 0) {
      searchCustomList(inputValue);
    }
  }, [inputValue, network, tezos, searchCustomList, lists]);

  const isEmptyTokens = useMemo(
    () => filteredTokens.length === 0
      && searchTokens.length === 0,
    [searchTokens, filteredTokens],
  );

  useEffect(() => handleTokenSearch(), [
    lists,
    inputValue,
    network,
    handleTokenSearch,
  ]);

  // const allLists = useMemo(() => (
  //   inputValue.length > 0 && filteredTokens.length === 0
  //     ? searchTokens
  //     : filteredTokens
  // ),
  // [inputValue, filteredTokens, searchTokens]);

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
          title={t('common|Choose List')}
          header={(
            <AutoSave
              form={form}
              debounce={1000}
              save={handleInput}
            />
            )}
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          {...props}
        >
          {isEmptyTokens && (!searchLoading && !listsLoading) && (
          <div className={s.tokenNotFound}>
            <TokenNotFound />
            <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>
            {' '}
          </div>
          )}
          {isEmptyTokens && (searchLoading || listsLoading) && (
            [1, 2, 3, 4, 5, 6, 7].map((x) => (<LoadingTokenCell key={x} />))
          )}
          {/* {allLists.map((list:WhitelistedTokenList) => {
            const {
              name, url,
            } = list;
            return (
              <ChooseListCell
                key={`${name}_${url}`}
                tokenList={list}
                tabIndex={0}
                onClick={() => {
                  if (searchTokens.length > 0) {
                    addCustomToken(token);
                  }
                }}
              />
            );
          })} */}
        </Modal>

      )}
    />
  );
};
