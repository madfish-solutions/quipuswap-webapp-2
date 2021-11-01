import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import {
  ICurrentTab,
  PositionModalFormValues,
  WhitelistedToken,
  WhitelistedTokenList,
  WhitelistedTokenPair,
} from '@utils/types';
import { localSearchListByNameOrUrl, localSearchToken, parseDecimals } from '@utils/helpers';
import {
  findTokensByList,
  isTokenFa2,
  useLists,
  useSearchCustomLists,
  useSearchCustomTokens,
  useSearchLists,
  useSearchTokens,
} from '@utils/tokenLists';
import { useNetwork, useTezos } from '@utils/dapp';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Input } from '@components/ui/Input';
import { Tabs } from '@components/ui/Tabs';
import { ListContent } from '@components/common/ListContent';
import Search from '@icons/Search.svg';

import { PairContent } from './PairContent';
import s from './PositionsModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const TabsContent = [
  {
    id: 'pairs',
    label: 'Pairs',
  },
  {
    id: 'lists',
    label: 'Lists',
  },
];

type PositionsModalProps = {
  onChange: (tokenPair: WhitelistedTokenPair) => void;
  initialPair?: WhitelistedTokenPair;
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
} & ReactModal.Props;

type HeaderProps = {
  isSecondInput: boolean;
  debounce: number;
  save: any;
  values: PositionModalFormValues;
  currentTab: ICurrentTab;
};

const Header: React.FC<HeaderProps> = ({ isSecondInput, debounce, save, values, currentTab }) => {
  const { t } = useTranslation(['common']);

  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef(setTimeout(() => {}, 0));
  const promise = useRef();

  const saveFunc = useCallback(async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    promise.current = save(values);
    await promise;
    setSubm(false);
  }, [save, values]);

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
  }, [values, debounce, saveFunc]);

  return (
    <div className={s.inputs}>
      <Field name="search">
        {({ input, meta }) => (
          <>
            {currentTab.id === 'pairs' ? (
              <Input
                {...input}
                StartAdornment={Search}
                className={s.modalInput}
                placeholder={t('common|Search')}
                error={meta.error}
                readOnly={!!(values.token1 && values.token2)}
              />
            ) : (
              <Input
                {...input}
                StartAdornment={Search}
                className={s.modalInput}
                placeholder={t('common|Search')}
                error={meta.error}
              />
            )}
          </>
        )}
      </Field>
      {isSecondInput && (
        <Field name="tokenId" parse={(v) => parseDecimals(v, 0, Infinity, 0)}>
          {({ input, meta }) => (
            <>
              <Input
                {...input}
                className={s.modalInput}
                placeholder={t('common|Token ID')}
                readOnly={!!(values.token1 && values.token2)}
                error={(meta.touched && meta.error) || meta.submitError}
              />
            </>
          )}
        </Field>
      )}
    </div>
  );
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
  const searchCustomList = useSearchCustomLists();
  const searchCustomToken = useSearchCustomTokens();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const tezos = useTezos();
  const { Form } = withTypes<PositionModalFormValues>();
  const { data: lists, loading: listsLoading } = useLists();
  const tokens = useMemo(() => findTokensByList(lists), [lists, listsLoading]);
  const network = useNetwork();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();
  const [filteredTokens, setFilteredTokens] = useState<WhitelistedToken[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputToken, setInputToken] = useState<string>('');
  const [isSoleFa2Token, setSoleFa2Token] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const { data: searchLists, loading: searchListsLoading } = useSearchLists();
  const [filteredLists, setFilteredLists] = useState<WhitelistedTokenList[]>([]);

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === tabsState)!, [tabsState]);

  const handleInput = useCallback(
    (values: PositionModalFormValues) => {
      setInputValue(values.search ?? '');
      setInputToken(isSoleFa2Token ? values.tokenId : '');
    },
    [isSoleFa2Token],
  );

  const handleTokenSearch = useCallback(() => {
    const isTokens = tokens.filter((token: any) =>
      localSearchToken(token, network, inputValue, inputToken),
    );
    setFilteredTokens(isTokens);
    if (inputValue.length > 0 && isTokens.length === 0) {
      searchCustomToken(inputValue, inputToken);
    }
  }, [inputToken, inputValue, network, tokens, searchCustomToken]);

  const handleListSearch = useCallback(() => {
    if (!tezos) return;
    const listArr = lists.filter((list: WhitelistedTokenList) =>
      localSearchListByNameOrUrl(list, inputValue),
    );
    setFilteredLists(listArr);
    if (inputValue.length > 0 && listArr.length === 0) {
      searchCustomList(inputValue);
    }
  }, [inputValue, tezos, searchCustomList, lists]);

  const isEmptyTokens = useMemo(
    () => filteredTokens.length === 0 && searchTokens.length === 0,
    [searchTokens, filteredTokens],
  );

  useEffect(() => {
    if (currentTab.id === TabsContent[1].id) {
      handleListSearch();
    }
  }, [currentTab, lists, inputValue, tezos, handleListSearch]);

  useEffect(() => {
    if (currentTab.id === TabsContent[0].id) {
      handleTokenSearch();
    }
  }, [currentTab, tokens, inputValue, inputToken, network, handleTokenSearch]);

  const allTokens = useMemo(
    () => (inputValue.length > 0 && filteredTokens.length === 0 ? searchTokens : filteredTokens),
    [inputValue, filteredTokens, searchTokens],
  );

  useEffect(() => {
    const getFa2 = async () => {
      const res = await isTokenFa2(inputValue, tezos!!);
      setSoleFa2Token(res);
    };
    getFa2();
  }, [inputValue, tezos]);

  const isEmptyLists = useMemo(
    () => filteredLists.length === 0 && searchLists.length === 0,
    [searchLists, filteredLists],
  );

  const allLists = useMemo(
    () => (inputValue.length > 0 && filteredLists.length === 0 ? searchLists : filteredLists),
    [inputValue, filteredLists, searchLists],
  );

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
          header={
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
            />
          }
          headerClassName={s.tabs}
          additional={
            <AutoSave
              form={form}
              debounce={0}
              save={handleInput}
              isSecondInput={isSoleFa2Token}
              currentTab={currentTab}
            />
          }
          footer={
            currentTab.id === 'pairs' && (
              <Button
                onClick={() =>
                  onChange({
                    token1: values.token1,
                    token2: values.token2,
                  } as WhitelistedTokenPair)
                }
                disabled={!values.token2 || !values.token1}
                className={s.modalButton}
                theme="primary"
              >
                {t('common|Select')}
              </Button>
            )
          }
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          onRequestClose={(e) => {
            if (values.token1 && values.token2) {
              onChange({ token1: values.token1, token2: values.token2 } as WhitelistedTokenPair);
            }
            if (onRequestClose) onRequestClose(e);
          }}
          {...props}
        >
          {currentTab.id === TabsContent[0].id ? (
            <PairContent
              isEmptyTokens={isEmptyTokens}
              searchLoading={searchLoading}
              notSelectable1={notSelectable1}
              notSelectable2={notSelectable2}
              allTokens={allTokens}
              form={form}
              setInputValue={setInputValue}
              setInputToken={setInputToken}
              searchTokens={searchTokens}
              values={values}
            />
          ) : (
            <ListContent
              allLists={allLists}
              isEmptyLists={isEmptyLists}
              searchLoading={searchListsLoading}
              listsLoading={listsLoading}
            />
          )}
        </Modal>
      )}
    />
  );
};
