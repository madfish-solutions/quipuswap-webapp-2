import React from 'react';
import { useTranslation } from 'next-i18next';
import { Field } from 'react-final-form';

import { useAddCustomToken } from '@utils/tokenLists';
import { isTokenEqual } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { LoadingTokenCell, TokenCell } from '@components/ui/Modal/ModalCell';
import { Checkbox } from '@components/ui/Checkbox';
import { MultiLoader } from '@components/ui/MultiLoader';
import { Plus } from '@components/svg/Plus';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './PositionsModal.module.sass';

type PairContentProps = {
  isEmptyTokens: boolean;
  searchLoading: boolean;
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
  allTokens: WhitelistedToken[];
  form: any;
  setInputValue: (value: string) => void;
  setInputToken: (value: string) => void;
  searchTokens: WhitelistedToken[];
  values: any;
};

export const PairContent: React.FC<PairContentProps> = ({
  isEmptyTokens,
  searchLoading,
  notSelectable1,
  notSelectable2,
  allTokens,
  form,
  setInputValue,
  setInputToken,
  searchTokens,
  values,
}) => {
  const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);
  return (
    <>
      <Field name="token1" initialValue={notSelectable1}>
        {({ input }) => {
          const token = input.value;
          if (!token) return '';
          return (
            <TokenCell
              token={token}
              tabIndex={0}
              onClick={() => {
                // onChange(token);
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
          <div className={s.listText}>{t('common|Search another Token')}</div>
        </div>
      )}
      <Field initialValue={notSelectable2} name="token2">
        {({ input }) => {
          const token = input.value;
          if (!token) return '';
          return (
            <TokenCell
              token={token}
              tabIndex={0}
              onClick={() => {
                if (!notSelectable2) {
                  form.mutators.setValue('token2', !values.token2 ? token : undefined);
                }
              }}
            >
              <Checkbox checked />
            </TokenCell>
          );
        }}
      </Field>
      {isEmptyTokens && !searchLoading && !values.token1 && !values.token2 && (
        <div className={s.tokenNotFound}>
          <TokenNotFound />
          <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>
        </div>
      )}
      {isEmptyTokens && searchLoading && <MultiLoader Component={LoadingTokenCell} count={7} />}
      {!values.token2 &&
        allTokens
          .filter((x) => !values.token1 || !isTokenEqual(x, values.token1))
          .map((token) => {
            const { contractAddress, fa2TokenId } = token;
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
    </>
  );
};
