import React from 'react';
import { useTranslation } from 'next-i18next';

import { useAddCustomToken } from '@utils/tokenLists';
import { WhitelistedToken } from '@utils/types';
import { LoadingTokenCell, TokenCell } from '@components/ui/Modal/ModalCell';
import { MultiLoader } from '@components/ui/MultiLoader';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './TokensModal.module.sass';

type TokenContentProps = {
  isEmptyTokens: boolean;
  searchLoading: boolean;
  listsLoading: boolean;
  onChange: (token: WhitelistedToken) => void;
  allTokens: WhitelistedToken[];
  form: any;
  setInputValue: (value: string) => void;
  setInputToken: (value: number) => void;
  searchTokens: WhitelistedToken[];
};

export const TokenContent: React.FC<TokenContentProps> = ({
  isEmptyTokens,
  searchLoading,
  listsLoading,
  onChange,
  allTokens,
  form,
  setInputValue,
  setInputToken,
  searchTokens,
}) => {
  const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);
  return (
    <>
      {isEmptyTokens && !searchLoading && !listsLoading && (
        <div className={s.tokenNotFound}>
          <TokenNotFound />
          <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>{' '}
        </div>
      )}
      {isEmptyTokens && (searchLoading || listsLoading) && (
        <MultiLoader Component={LoadingTokenCell} count={7} />
      )}
      {allTokens.map((token) => {
        const { contractAddress, fa2TokenId } = token;
        return (
          <TokenCell
            key={`${contractAddress}_${fa2TokenId ?? 0}`}
            token={token}
            tabIndex={0}
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
          />
        );
      })}
    </>
  );
};
