import React, { useRef, useState, useEffect, useContext } from 'react';

import {
  Modal,
  Input,
  Search,
  BakerCell,
  ColorModes,
  TokenNotFound,
  LoadingBakerCell,
  ColorThemeContext
} from '@quipuswap/ui-kit';
import cx from 'classnames';
import { Field, FormSpy, withTypes } from 'react-final-form';
import ReactModal from 'react-modal';
import { noop } from 'rxjs';

import { appi18n } from '@app.i18n';
import { useBakers } from '@utils/dapp';
import { localSearchBaker } from '@utils/helpers';
import { isFullBaker, WhitelistedBaker } from '@utils/types';

import s from './BakersModal.module.sass';

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
  const { t } = appi18n;

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
  const { t } = appi18n;
  const { Form } = withTypes<FormValues>();
  const { data: bakers, loading } = useBakers();
  const [filteredBakers, setFilteredBakers] = useState<WhitelistedBaker[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInput = (values: FormValues) => {
    setInputValue(values.search ?? '');
  };

  const handleTokenSearch = () => {
    const isBakers = bakers.filter(baker => localSearchBaker(baker, inputValue));
    setFilteredBakers(isBakers);
  };

  const isEmptyBakers = filteredBakers.length === 0;

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
          {loading && [1, 2, 3, 4, 5, 6].map(x => <LoadingBakerCell key={x} />)}
          {filteredBakers.map(baker => (
            <BakerCell
              key={baker.address}
              bakerName={isFullBaker(baker) ? baker.name : baker.address}
              bakerFee={isFullBaker(baker) ? baker.fee.toString() : ''}
              bakerFreeSpace={isFullBaker(baker) ? baker.freeSpace.toString() : ''}
              bakerLogo={isFullBaker(baker) ? baker.logo : ''}
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
