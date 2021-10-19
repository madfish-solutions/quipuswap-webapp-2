import React, {
  useContext, useEffect, useRef, useState, useMemo, useCallback,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import {
  useTezos,
  useNetwork,
} from '@utils/dapp';
import {
  useLists,
  useSearchCustomLists,
  useSearchCustomTokens,
  useSearchLists,
  useSearchTokens,
  findTokensByList,
  isTokenFa2,
} from '@utils/tokenLists';
import {
  parseNumber, localSearchToken, isTokenEqual, localSearchListByNameOrUrl,
} from '@utils/helpers';

import { WhitelistedToken, WhitelistedTokenList } from '@utils/types';
import { validateMinMax } from '@utils/validators';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
import { Input } from '@components/ui/Input';
import { NumberInput } from '@components/ui/NumberInput';
import { ListContent } from '@components/common/ListContent';
import Search from '@icons/Search.svg';

import { Tabs } from '@components/ui/Tabs';
import s from './TokensModal.module.sass';
import { TokenContent } from './TokenContent';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const TabsContent = [
  {
    id: 'tokens',
    label: 'Tokens',
  },
  {
    id: 'lists',
    label: 'Lists',
  },
];

type TokensModalProps = {
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
              placeholder={t('common|Search')}
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
              placeholder={t('common|Token ID')}
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

export const TokensModal: React.FC<TokensModalProps> = ({
  onChange,
  blackListedTokens = [],
  ...props
}) => {
  const searchCustomList = useSearchCustomLists();
  const searchCustomToken = useSearchCustomTokens();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const tezos = useTezos();
  const network = useNetwork();
  const { Form } = withTypes<FormValues>();
  const { data: lists, loading: listsLoading } = useLists();
  const tokens = useMemo(() => findTokensByList(lists), [lists]);
  // const { data: tokens, loading: tokensLoading } = useTokens();
  const { data: searchTokens, loading: searchLoading } = useSearchTokens();
  const [filteredTokens, setFilteredTokens] = useState<WhitelistedToken[]>([]);
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputToken, setInputToken] = useState<number>(0);
  const [isSoleFa2Token, setSoleFa2Token] = useState<boolean>(false);
  const { data: searchLists, loading: searchListsLoading } = useSearchLists();
  const [filteredLists, setFilteredLists] = useState<WhitelistedTokenList[]>([]);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleInput = useCallback((values:FormValues) => {
    if (currentTab.id === TabsContent[0].id) {
      setInputValue(values.search ?? '');
      setInputToken(isSoleFa2Token ? values.tokenId : 0);
    } else {
      setInputValue(values.search ?? '');
    }
  }, [setInputValue, setInputToken, isSoleFa2Token, currentTab]);

  const handleTokenSearch = useCallback(() => {
    if (!network || !tezos) return;
    const searchTokensArr = tokens
      .filter(
        (token:any) => localSearchToken(
          token,
          network,
          inputValue,
          inputToken,
        ),
      );
    setFilteredTokens(searchTokensArr);
    if (inputValue.length > 0 && searchTokensArr.length === 0) {
      searchCustomToken(inputValue, inputToken);
    }
  }, [inputValue, inputToken, network, tezos, searchCustomToken, tokens]);

  const handleListSearch = useCallback(() => {
    if (!tezos) return;
    const listArr = lists
      .filter(
        (list:WhitelistedTokenList) => localSearchListByNameOrUrl(
          list,
          inputValue,
        ),
      );
    setFilteredLists(listArr);
    if (inputValue.length > 0 && listArr.length === 0) {
      searchCustomList(inputValue);
    }
  }, [inputValue, tezos, searchCustomList, lists]);

  const isEmptyTokens = useMemo(
    () => filteredTokens.length === 0
    && searchTokens.length === 0,
    [searchTokens, filteredTokens],
  );

  useEffect(() => {
    if (currentTab.id === TabsContent[1].id) {
      handleListSearch();
    }
  },
  [
    currentTab,
    lists,
    inputValue,
    tezos,
    handleListSearch,
  ]);

  useEffect(() => {
    if (currentTab.id === TabsContent[0].id) {
      handleTokenSearch();
    }
  }, [
    currentTab,
    tokens,
    inputValue,
    inputToken,
    network,
    handleTokenSearch,
  ]);

  const allTokens = useMemo(() => (
    inputValue.length > 0 && filteredTokens.length === 0
      ? searchTokens
      : filteredTokens
  )
    .filter((x) => !blackListedTokens.find((y) => isTokenEqual(x, y))),
  [inputValue, filteredTokens, searchTokens, blackListedTokens]);

  useEffect(() => {
    const getFa2 = async () => {
      const res = await isTokenFa2(inputValue, tezos!!);
      setSoleFa2Token(res);
    };
    getFa2();
  }, [inputValue, tezos]);

  const isEmptyLists = useMemo(
    () => filteredLists.length === 0
      && searchLists.length === 0,
    [searchLists, filteredLists],
  );

  const allLists = useMemo(() => (
    inputValue.length > 0 && filteredLists.length === 0
      ? searchLists
      : filteredLists
  ),
  [inputValue, filteredLists, searchLists]);

  return (
    <>
      <Form
        onSubmit={handleInput}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ form }) => (
          <Modal
            title={t('common|Search token')}
            header={(
              <Tabs
                values={TabsContent}
                activeId={tabsState}
                setActiveId={(val) => setTabsState(val)}
              />
            )}
            headerClassName={s.tabs}
            additional={(
              <AutoSave
                form={form}
                debounce={0}
                save={handleInput}
                isSecondInput={isSoleFa2Token}
              />
            )}
            className={themeClass[colorThemeMode]}
            modalClassName={s.tokenModal}
            containerClassName={s.tokenModal}
            cardClassName={cx(s.tokenModal, s.maxHeight)}
            contentClassName={cx(s.tokenModal)}
            {...props}
          >
            {currentTab.id === TabsContent[0].id ? (
              <TokenContent
                isEmptyTokens={isEmptyTokens}
                searchLoading={searchLoading}
                listsLoading={listsLoading}
                onChange={onChange}
                allTokens={allTokens}
                form={form}
                setInputValue={setInputValue}
                setInputToken={setInputToken}
                searchTokens={searchTokens}
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
    </>
  );
};
