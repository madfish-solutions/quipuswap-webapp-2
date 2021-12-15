import React, { useEffect, useRef, useState } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';
import { Field } from 'react-final-form';

import s from '@components/modals/TokensModal/TokensModal.module.sass';
import { parseNumber } from '@utils/helpers';
import { validateMinMax } from '@utils/validators';

export interface HeaderProps {
  isSecondInput: boolean;
  debounce: number;
  save: never;
  values: never;
  form: never;
}

export const Header: React.FC<HeaderProps> = ({ isSecondInput, debounce, save, values, form }) => {
  const { t } = useTranslation(['common']);

  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise: never;

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    // @ts-ignore
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
    // eslint-disable-next-line
  }, [debounce, values]);

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
            autoFocus
          />
        )}
      </Field>
      {isSecondInput && (
        <Field name="tokenId" validate={validateMinMax(0, 100)} parse={value => parseNumber(value, 0, 100)}>
          {({ input, meta }) => (
            <>
              <NumberInput
                {...input}
                className={s.modalInput}
                placeholder={t('common|Token ID')}
                step={1}
                min={0}
                max={100}
                error={(meta.touched && meta.error) || meta.submitError}
                onIncrementClick={() => {
                  // @ts-ignore
                  form.mutators.setValue('tokenId', +input.value + 1 > 100 ? 100 : +input.value + 1);
                }}
                onDecrementClick={() => {
                  // @ts-ignore
                  form.mutators.setValue('tokenId', +input.value - 1 < 1 ? 1 : +input.value - 1);
                }}
              />
            </>
          )}
        </Field>
      )}
    </div>
  );
};
