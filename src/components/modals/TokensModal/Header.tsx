import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import s from '@components/modals/TokensModal/TokensModal.module.sass';
import { Field } from 'react-final-form';
import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import { validateMinMax } from '@utils/validators';
import { parseNumber } from '@utils/helpers';

export interface HeaderProps {
  isSecondInput:boolean
  debounce:number,
  save:any,
  values:any,
  form:any,
}

export const Header: React.FC<HeaderProps> = ({
  isSecondInput, debounce, save, values, form,
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
      {(isSecondInput) && (
        <Field
          name="tokenId"
          validate={validateMinMax(0, 100)}
          parse={(value) => parseNumber(value, 0, 100)}
        >
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
                  form.mutators.setValue(
                    'tokenId',
                    +input.value + 1 > 100 ? 100 : +input.value + 1,
                  );
                }}
                onDecrementClick={() => {
                  form.mutators.setValue(
                    'tokenId',
                    +input.value - 1 < 1 ? 1 : +input.value - 1,
                  );
                }}
              />
            </>
          )}
        </Field>
      )}
    </div>
  );
};
