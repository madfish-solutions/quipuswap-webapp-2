import React, {
  useContext, useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import {
  useTezos,
  useToggleList,
  useNetwork,
  useLists,
  useSearchLists,
  useSearchCustomLists,
} from '@utils/dapp';
import {
  localSearchList,
} from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenList } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
import { ChooseListCell, LoadingTokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import Search from '@icons/Search.svg';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './ListModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type ListModalProps = {
  onChange: (token: WhitelistedToken) => void,
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
  const searchCustomList = useSearchCustomLists();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const toggle = useToggleList();
  const tezos = useTezos();
  const network = useNetwork();
  const { Form } = withTypes<FormValues>();
  const { data: lists, loading: listsLoading } = useLists();
  const { data: searchLists, loading: searchLoading } = useSearchLists();
  const [filteredLists, setFilteredLists] = useState<WhitelistedTokenList[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
  };

  const handleTokenSearch = useCallback(() => {
    if (!tezos) return;
    const isList = lists
      .filter(
        (list:WhitelistedTokenList) => localSearchList(
          list,
          inputValue,
        ),
      );
    setFilteredLists(isList);
    if (inputValue.length > 0 && isList.length === 0) {
      searchCustomList(inputValue);
    }
  }, [inputValue, network, tezos, searchCustomList, lists]);

  const isEmptyLists = useMemo(
    () => filteredLists.length === 0
      && searchLists.length === 0,
    [searchLists, filteredLists],
  );

  useEffect(() => handleTokenSearch(), [
    lists,
    inputValue,
    network,
    handleTokenSearch,
  ]);

  const allLists = useMemo(() => (
    inputValue.length > 0 && filteredLists.length === 0
      ? searchLists
      : filteredLists
  ),
  [inputValue, filteredLists, searchLists]);

  console.log(isEmptyLists, filteredLists, searchLists, lists, listsLoading);

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
          {isEmptyLists && (!searchLoading && !listsLoading) && (
          <div className={s.tokenNotFound}>
            <TokenNotFound />
            <div className={s.notFoundLabel}>{t('common|No lists found')}</div>
            {' '}
          </div>
          )}
          {isEmptyLists && (searchLoading || listsLoading) && (
            [1, 2, 3, 4, 5, 6, 7].map((x) => (<LoadingTokenCell key={x} />))
          )}
          {allLists.map((list:WhitelistedTokenList, i) => {
            const {
              url, enabled,
            } = list;
            return (
              <ChooseListCell
                key={url}
                tokenList={list}
                tabIndex={i}
                isActive={!!enabled}
                onChange={() => toggle(url)}
              />
            );
          })}
        </Modal>

      )}
    />
  );
};
