import React, { useRef, useState, useEffect, useContext } from 'react';

import {
  Modal,
  Input,
  Search,
  ColorModes,
  TokenNotFound,
  LoadingBakerCell,
  ColorThemeContext
} from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';
import ReactModal from 'react-modal';
import { noop } from 'rxjs';

import { BakerCell } from '@components/ui/components';
import { useBakers, useSearchBakers, useSearchCustomBaker } from '@utils/dapp';
import { isEmptyArray, localSearchBaker } from '@utils/helpers';
import { isBackerNotEmpty } from '@utils/helpers/is-backer-not-empty';
import { WhitelistedBaker } from '@utils/types';
import { isValidBakerAddress } from '@utils/validators';

import s from './bakers-modal.module.scss';

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
          header={<AutoSave form={form} debounce={1000} save={handleInput} />}
          className={themeClass[colorThemeMode]}
          modalClassName={s.tokenModal}
          containerClassName={s.tokenModal}
          cardClassName={cx(s.tokenModal, s.maxHeight)}
          contentClassName={cx(s.tokenModal)}
          {...props}
        >
          {isEmptyBakers && (
            <div className={s.tokenNotFound}>
              <TokenNotFound />
              <div className={s.notFoundLabel}>{t('common|No bakers found')}</div>
            </div>
          )}
          {isLoading && [1, 2, 3, 4, 5, 6].map(x => <LoadingBakerCell key={x} />)}
          {!isLoading &&
            bakerList.map(baker => (
              <BakerCell
                key={baker.address}
                bakerName={isBackerNotEmpty(baker) ? baker.name : baker.address}
                bakerFee={isBackerNotEmpty(baker) ? baker.fee.toString() : ''}
                bakerFreeSpace={isBackerNotEmpty(baker) ? baker.freeSpace.toString() : ''}
                bakerLogo={isBackerNotEmpty(baker) ? baker.logo : ''}
                tabIndex={0}
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
