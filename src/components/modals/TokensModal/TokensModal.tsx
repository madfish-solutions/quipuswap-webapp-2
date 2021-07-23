import React from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import { useAddCustomToken, useTokens } from '@utils/dapp';
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

type HeaderProps = {
  isSecondInput:boolean
  debounce:number,
  save:any,
  values:any
};

type FormValues = {
  search: string
  tokenId: number
};

const Header:React.FC<HeaderProps> = ({
  isSecondInput, debounce, save, values,
}) => {
  const { t } = useTranslation(['common']);

  const [, setVal] = React.useState(values);
  const [, setSubm] = React.useState<boolean>(false);

  let timeout:any;
  let promise:any;

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }

    if (true) {
      // values have changed
      setVal(values);
      setSubm(true);
      promise = save(values);
      await promise;
      setSubm(false);
    }
  };

  React.useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(saveFunc, debounce);
  }, [values]);

  return (
    <div className={s.inputs}>
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
            <Input
              {...input}
              EndAdornment={Search}
              className={s.modalInput}
              placeholder={t('common:Token ID')}
              error={meta.error}
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
  ...props
}) => {
  const addCustomToken = useAddCustomToken();
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();
  const tokens = useTokens();
  const [filteredTokens, setFilteredTokens] = React.useState<WhitelistedToken[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [inputToken, setInputToken] = React.useState<number>(0);

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
    setInputToken(values.tokenId);
  };

  const handleTokenSearch = () => {
    const isTokens = tokens
      .filter(
        (token) => searchToken(
          token,
          MAINNET_NETWORK,
          inputValue,
          inputToken,
        ),
      );
    setFilteredTokens(isTokens);
    if (inputValue.length > 0 && isTokens.length === 0) {
      addCustomToken(inputValue, inputToken);
    }
  };

  React.useEffect(() => handleTokenSearch(), [tokens, inputValue, inputToken]);
  const isSoleFa2Token = React.useMemo(
    () => filteredTokens.find(
      (x) => x.contractAddress === inputValue,
    )?.type === 'fa2' || typeof inputToken !== undefined, [filteredTokens, inputValue, inputToken],
  );
  return (
    <Form
      onSubmit={handleInput}
      render={() => (

        <Modal
          title={t('common:Search token')}
          header={
            <AutoSave debounce={1000} save={handleInput} isSecondInput={isSoleFa2Token} />
              }
          footer={(
            <Button className={s.modalButton} theme="inverse">
              Manage Lists
              <Pen className={s.penIcon} />

            </Button>
          )}
          {...props}
        >
          {filteredTokens.map((token) => {
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
