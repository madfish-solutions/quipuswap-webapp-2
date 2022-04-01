import React, { useRef, useState, useEffect, useContext } from 'react';

import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';
import ReactModal from 'react-modal';
import { noop } from 'rxjs';

import { TEZOS_TOKEN } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useBakers, useSearchBakers, useSearchCustomBaker } from '@providers/dapp-bakers';
import { BakerCell, Input, LoadingBakerCell } from '@shared/components';
import {
  AddressTransformation,
  formatBalance,
  getBakerName,
  isBackerNotEmpty,
  isEmptyArray,
  localSearchBaker
} from '@shared/helpers';
import { NotFound, Search } from '@shared/svg';
import { WhitelistedBaker } from '@shared/types';
import { isValidBakerAddress } from '@shared/validators';

import { Modal } from '../modal';
import s from './bakers-modal.module.scss';
import { fixBakerFee } from './fix-baker-fee';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface BakersModalProps extends ReactModal.Props {
  onChange: (baker: WhitelistedBaker) => void;
}

interface HeaderProps {
  debounce: number;
  save: never;
  values: FormValues;
  form: never;
}

interface FormValues {
  search: string;
}

const LOADING_ARRAY = [1, 2, 3, 4, 5, 6];
const TAB_INDEX = 0;
const AUTOSAVE_DEBOUNCE_MS = 1000;

const Header: React.FC<HeaderProps> = ({ debounce, save, values }) => {
  const { t } = useTranslation(['common']);

  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef(setTimeout(noop, 0));
  let promise: never;

  const saveFunc = async () => {
    if (promise) {
      // TODO: Remove this fucking shit
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await promise;
    }
    setVal(values);
    setSubm(true);
    // @ts-ignore
    promise = save(values);
    // eslint-disable-next-line @typescript-eslint/await-thenable
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
    // eslint-disable-next-line
  }, [values]);

  return (
    <div className={s.inputs}>
      <Field name="search">
        {({ input, meta }) => (
          <Input
            {...input}
            StartAdornment={Search}
            className={s.modalInput}
            placeholder={t('common|Search')}
            error={meta.error}
          />
        )}
      </Field>
    </div>
  );
};

// eslint-disable-next-line
const AutoSave = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={Header} />;

export const BakersModal: React.FC<BakersModalProps> = ({ onChange, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();
  const { data: bakers, loading } = useBakers();
  const [filteredBakers, setFilteredBakers] = useState<WhitelistedBaker[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const searchCustomBaker = useSearchCustomBaker();
  const { data: searchBakers, loading: isSearching } = useSearchBakers();

  const handleInput = (values: FormValues) => {
    setInputValue(values.search ?? '');
  };

  const handleTokenSearch = () => {
    const localFilteredBakers = bakers.filter(baker => localSearchBaker(baker, inputValue));

    setFilteredBakers(localFilteredBakers);

    if (isEmptyArray(localFilteredBakers) && isValidBakerAddress(inputValue)) {
      searchCustomBaker(inputValue);
    }
  };

  const isEmptyBakers = isEmptyArray(filteredBakers) && isEmptyArray(searchBakers);
  const isLoading = loading || isSearching;

  const bakerList = !isEmptyArray(filteredBakers) ? filteredBakers : searchBakers;

  // eslint-disable-next-line
  useEffect(() => handleTokenSearch(), [bakers, inputValue]);

  const getBakerFee = (baker: WhitelistedBaker) => (isBackerNotEmpty(baker) ? fixBakerFee(baker.fee) : '');
  const getBakerLogo = (baker: WhitelistedBaker) => ('logo' in baker ? baker.logo : '');
  const getBakerFreeSpace = (baker: WhitelistedBaker) => {
    if (isBackerNotEmpty(baker)) {
      const freeSpace = baker.freeSpace.toFixed(TEZOS_TOKEN.metadata.decimals);

      return formatBalance(freeSpace);
    } else {
      return '';
    }
  };

  return (
    <Form
      onSubmit={handleInput}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        }
      }}
      render={({ form }) => (
        <Modal
          title={t('common|Bakers List')}
          header={<AutoSave form={form} debounce={AUTOSAVE_DEBOUNCE_MS} save={handleInput} />}
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          {...props}
        >
          {isEmptyBakers && (
            <div className={s.tokenNotFound}>
              <NotFound />
              <div className={s.notFoundLabel}>{t('common|No bakers found')}</div>
            </div>
          )}
          {isLoading && LOADING_ARRAY.map(x => <LoadingBakerCell key={x} />)}
          {!isLoading &&
            bakerList.map(baker => (
              <BakerCell
                key={baker.address}
                bakerName={getBakerName(baker, AddressTransformation.NONE)}
                bakerFee={getBakerFee(baker)}
                bakerFreeSpace={getBakerFreeSpace(baker)}
                bakerLogo={getBakerLogo(baker)}
                tabIndex={TAB_INDEX}
                onClick={() => {
                  onChange(baker);
                  form.mutators.setValue('search', '');
                  setInputValue('');
                }}
              />
            ))}
        </Modal>
      )}
    />
  );
};
