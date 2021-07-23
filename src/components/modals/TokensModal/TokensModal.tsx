// import React, { useCallback, useEffect, useMemo } from 'react';
import React, { useCallback } from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'next-i18next';
import { Field, withTypes } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { useAddCustomToken, useTokens } from '@utils/dapp';
// import { useTokens } from '@utils/dapp';
// import { debounce, parseNumber } from '@utils/helpers';
import { parseNumber, searchToken } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { isContractAddress, validateMinMax } from '@utils/validators';
import { MAINNET_NETWORK } from '@utils/defaults';
import { Modal } from '@components/ui/Modal';
import { TokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Pen } from '@components/svg/Pen';
import Search from '@icons/Search.svg';

import s from './TokensModal.module.sass';

type TokensModalProps = {
  onChange: (token: WhitelistedToken) => void
} & ReactModal.Props;

type FormValues = {
  search: string
  tokenId: number
};

export const TokensModal: React.FC<TokensModalProps> = ({
  onChange,
  ...props
}) => {
  const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();
  const tokens = useTokens();
  // const [filteredTokens, setFilteredTokens] = React.useState<WhitelistedToken[]>([]);

  // const debouncedFilter = debounce(
  //   () => {
  //     const buff = tokens.filter(
  //       ({
  //         metadata,
  //         contractAddress,
  //         fa2TokenId,
  //       }) => {
  //         const isName = metadata.name?.toLowerCase().includes(oldInput.toLowerCase());
  //         const isSymbol = metadata.symbol?.toLowerCase().includes(oldInput.toLowerCase());
  //         const isContract = contractAddress.toLowerCase().includes(oldInput.toLowerCase());
  //         if (fa2TokenId || oldInputToken.length > 0) {
  //           let isFa2 = fa2TokenId === parseInt(oldInputToken, 10);
  //           if (!oldInputToken) isFa2 = true;
  //           const res = ((isName
  //             || isSymbol
  //             || isContract)
  //             && isFa2);
  //           return res;
  //         }
  //         const res = (isName
  //           || isSymbol
  //           || isContract);
  //         return res;
  //       },
  //     );
  //     if (buff.length === 0 && oldInput.length > 0) {
  //       addCustomToken(oldInput, parseInt(oldInputToken, 10));
  //     }
  //     setFilteredTokens(buff);
  //   },
  //   1000,
  // );

  // useEffect(() => {
  //   debouncedFilter();
  // }, [tokens]);

  // const isSoleFa2Token = useMemo(
  //   () => filteredTokens.find(
  // (x) => x.contractAddress === inputValue)?.type === 'fa2', [filteredTokens, inputValue],
  // );

  // const isSoleFa2Token = true;

  const onSubmit = useCallback(async (
    values: FormValues,
  ) => {
    console.log('submit', values);
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      render={({
        handleSubmit, values,
      }) => (
        <Modal
          title={t('common:Search token')}
          header={(

            <form onSubmit={handleSubmit} className={s.inputs}>
              <Field
                name="search"
                validate={isContractAddress}
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
                    <OnChange name="search">
                      {(value) => {
                        const isTokens = tokens
                          .filter(
                            (token) => searchToken(
                              token,
                              MAINNET_NETWORK,
                              values.search ?? '',
                              values.tokenId,
                            ),
                          );
                        if (value && isTokens.length === 0) {
                          addCustomToken(values.search, values.tokenId);
                        }
                      }}
                    </OnChange>
                  </>
                )}

              </Field>
              {(tokens
                .filter(
                  (token) => searchToken(
                    token,
                    MAINNET_NETWORK,
                    values.search ?? '',
                    values.tokenId,
                  ),
                ).find(
                  (x) => x.contractAddress === values.search,
                )?.type === 'fa2' || values.tokenId >= 0) && (
                <Field
                  name="tokenId"
                  validate={validateMinMax(0, 100)}
                  parse={(value) => parseNumber(value, 1, 100)}
                >
                  {({ input, meta }) => (
                    <>
                      <Input
                        {...input}
                        EndAdornment={Search}
                        className={s.modalInput}
                        placeholder={t('common:Token ID')}
                        error={meta.error}
                      />
                      <OnChange name="tokenId">
                        {(value) => {
                          const isTokens = tokens
                            .filter(
                              (token) => searchToken(
                                token,
                                MAINNET_NETWORK,
                                values.search ?? '',
                                values.tokenId,
                              ),
                            );
                          if (value && isTokens.length === 0) {
                            addCustomToken(values.search, values.tokenId);
                          }
                        }}
                      </OnChange>
                    </>
                  )}
                </Field>
              )}
            </form>
          )}
          footer={(
            <Button className={s.modalButton} theme="inverse">
              Manage Lists
              <Pen className={s.penIcon} />

            </Button>
          )}
          {...props}
        >
          {tokens
            .filter(
              (token) => searchToken(
                token,
                MAINNET_NETWORK,
                values.search ?? '',
                values.tokenId,
              ),
            )
            .map((token) => {
              const {
                contractAddress, fa2TokenId,
              } = token;
              return (
                <div aria-hidden key={`${contractAddress}_${fa2TokenId ?? 0}`} onClick={() => onChange(token)}>
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
