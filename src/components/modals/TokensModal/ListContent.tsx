import React from 'react';
import { useTranslation } from 'next-i18next';

import {
  useRemoveList, useToggleList,
} from '@utils/dapp';
import { WhitelistedTokenList } from '@utils/types';
import {
  ChooseListCell, LoadingChooseListCell,
} from '@components/ui/Modal/ModalCell';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './TokensModal.module.sass';

type ListContentProps = {
  allLists:WhitelistedTokenList[],
  isEmptyLists:boolean
  searchLoading: boolean
  listsLoading: boolean
};

export const ListContent: React.FC<ListContentProps> = ({
  allLists,
  isEmptyLists,
  searchLoading,
  listsLoading,
}) => {
  const toggle = useToggleList();
  const removeList = useRemoveList();
  const { t } = useTranslation(['common']);
  return (
    <>
      {isEmptyLists && (!searchLoading && !listsLoading) && (
      <div className={s.tokenNotFound}>
        <TokenNotFound />
        <div className={s.notFoundLabel}>{t('common|No lists found')}</div>
        {' '}
      </div>
      )}
      {isEmptyLists && (searchLoading || listsLoading) && (
        [1, 2, 3, 4, 5, 6, 7].map((x) => (<LoadingChooseListCell key={x} />))
      )}
      {allLists.map((list:WhitelistedTokenList) => {
        const {
          url, enabled,
        } = list;
        return (
          <ChooseListCell
            key={url}
            tokenList={list}
            isActive={!!enabled}
            onChange={() => {
              toggle(url);
            }}
            onRemove={() => removeList(url)}
          />
        );
      })}
    </>
  );
};
