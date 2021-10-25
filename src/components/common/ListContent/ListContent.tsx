import cx from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';

import { useToggleList, useRemoveList } from '@utils/tokenLists';
import { WhitelistedTokenList } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ChooseListCell, LoadingChooseListCell } from '@components/ui/Modal/ModalCell';
import { MultiLoader } from '@components/ui/MultiLoader';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './ListContent.module.sass';

type ListContentProps = {
  allLists: WhitelistedTokenList[];
  isEmptyLists: boolean;
  searchLoading: boolean;
  listsLoading: boolean;
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ListContent: React.FC<ListContentProps> = ({
  allLists,
  isEmptyLists,
  searchLoading,
  listsLoading,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const toggle = useToggleList();
  const removeList = useRemoveList();
  const { t } = useTranslation(['common']);
  return (
    <>
      {isEmptyLists && !searchLoading && !listsLoading && (
        <div className={cx(themeClass[colorThemeMode], s.tokenNotFound)}>
          <TokenNotFound />
          <div className={s.notFoundLabel}>{t('common|No lists found')}</div>{' '}
        </div>
      )}
      {isEmptyLists && (searchLoading || listsLoading) && (
        <MultiLoader Component={LoadingChooseListCell} count={7} />
      )}
      {allLists.map((list: WhitelistedTokenList) => {
        const { url, enabled } = list;
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
