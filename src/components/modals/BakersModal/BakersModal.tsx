import React from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  useAddCustomBaker, useBakers, useSearchBakers, useSearchCustomBaker,
} from '@utils/dapp';
import { localSearchBaker } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';
import { MAINNET_NETWORK } from '@utils/defaults';
import { Modal } from '@components/ui/Modal';
import { BakerCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import Search from '@icons/Search.svg';
import TokenNotFound from '@icons/TokenNotFound.svg';

import s from './BakersModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type BakersModalProps = {
  onChange: (baker: WhitelistedBaker) => void
} & ReactModal.Props;

type HeaderProps = {
  debounce:number,
  save:any,
  values:any,
};

type FormValues = {
  search: string
  tokenId: number
};

const Header:React.FC<HeaderProps> = ({
  debounce, save, values,
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
    setVal(values);
    setSubm(true);
    promise = save(values);
    await promise;
    setSubm(false);
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
    </div>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

type ModalLoaderProps = {
  isEmptyBakers:boolean
  searchLoading:boolean,
};

const ModalLoader: React.FC<ModalLoaderProps> = ({ isEmptyBakers, searchLoading }) => {
  const { t } = useTranslation(['common']);
  if (isEmptyBakers && !searchLoading) {
    return (
      <div className={s.tokenNotFound}>
        <TokenNotFound />
        <div className={s.notFoundLabel}>{t('common:No tokens found')}</div>
        {' '}
      </div>
    );
  } if (isEmptyBakers && searchLoading) {
    return (
      <div>
        {[1, 2, 3, 4, 5, 6, 7].map((x) => (
          <BakerCell
            key={x}
            loading
          />
        ))}
      </div>
    );
  }
  return null;
};

export const BakersModal: React.FC<BakersModalProps> = ({
  onChange,
  ...props
}) => {
  const addCustomBaker = useAddCustomBaker();
  const searchCustomBaker = useSearchCustomBaker();
  const { colorThemeMode } = React.useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();
  const { data: bakers } = useBakers();
  const { data: searchBakers, loading: searchLoading } = useSearchBakers();
  const [filteredBakers, setFilteredBakers] = React.useState<WhitelistedBaker[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
  };

  // console.log(tokensLoading, searchLoading);

  const handleTokenSearch = () => {
    const isBakers = bakers
      .filter(
        (baker) => localSearchBaker(
          baker,
          MAINNET_NETWORK,
          inputValue,
        ),
      );
    setFilteredBakers(isBakers);
    if (inputValue.length > 0 && isBakers.length === 0) {
      searchCustomBaker(inputValue);
    }
  };

  const isEmptyBakers = filteredBakers.length === 0 && searchBakers.length === 0;

  React.useEffect(() => handleTokenSearch(), [bakers, inputValue]);

  const allTokens = inputValue.length > 0 && filteredBakers.length === 0
    ? searchBakers : filteredBakers;
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
          title={t('common:Bakers List')}
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
          <ModalLoader
            isEmptyBakers={isEmptyBakers}
            searchLoading={searchLoading}
          />
          {allTokens.map((baker) => {
            const {
              contractAddress,
            } = baker;
            return (
              <div
                aria-hidden
                key={contractAddress}
                onClick={() => {
                  // onChange(baker);
                  if (searchBakers.length > 0) {
                    addCustomBaker(baker);
                  }
                  form.mutators.setValue('search', '');
                  setInputValue('');
                }}
              >
                <BakerCell
                  baker={baker}
                />
              </div>
            );
          })}
        </Modal>

      )}
    />
  );
};
