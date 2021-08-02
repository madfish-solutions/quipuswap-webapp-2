import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import {
  useBakers,
} from '@utils/dapp';
import { localSearchBaker } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
import { BakerCell, LoadingTokenCell } from '@components/ui/Modal/ModalCell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Pen } from '@components/svg/Pen';
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
  form:any,
};

type FormValues = {
  search: string
};

const Header:React.FC<HeaderProps> = ({
  debounce, save, values,
}) => {
  const { t } = useTranslation(['common']);

  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef(setTimeout(() => {}, 0));
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

export const BakersModal: React.FC<BakersModalProps> = ({
  onChange,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();
  const { data: bakers } = useBakers();
  const [filteredBakers, setFilteredBakers] = useState<WhitelistedBaker[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInput = (values:FormValues) => {
    setInputValue(values.search ?? '');
  };

  const handleTokenSearch = () => {
    const isBakers = bakers
      .filter(
        (baker) => localSearchBaker(
          baker,
          inputValue,
        ),
      );
    setFilteredBakers(isBakers);
    // if (inputValue.length > 0 && isBakers.length === 0) {
    //   searchCustomToken(inputValue, inputToken);
    // }
  };

  const isEmptyBakers = filteredBakers.length === 0;

  useEffect(() => handleTokenSearch(), [bakers, inputValue]);

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
          footer={(
            <Button className={s.modalButton} theme="inverse">
              Manage Lists
              <Pen className={s.penIcon} />

            </Button>
          )}
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
              <div className={s.notFoundLabel}>{t('common:No tokens found')}</div>
              {' '}
            </div>
          )}
          {isEmptyBakers && (
            [1, 2, 3, 4, 5, 6, 7].map((x) => (<LoadingTokenCell key={x} />))
          )}
          {filteredBakers.map((baker) => {
            const {
              contractAddress,
            } = baker;
            return (
              <BakerCell
                key={contractAddress}
                baker={baker}
                tabIndex={0}
                onClick={() => {
                  onChange(baker);
                  // if (searchBakers.length > 0) {
                  //   addCustomToken(token);
                  // }
                  form.mutators.setValue('search', '');
                  setInputValue('');
                }}
              />
            );
          })}
        </Modal>

      )}
    />
  );
};
