import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import { Field } from 'react-final-form';

import { appi18n } from '@app.i18n';
import { validateMinMax } from '@utils/validators';

import s from './PositionsModal.module.sass';
import { HeaderProps } from './PositionsModal.types';

export const Header: React.FC<HeaderProps> = ({ isSecondInput, debounce, save, values, form }) => {
  const { t } = appi18n;

  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef<NodeJS.Timeout>();
  const promise = useRef<Promise<never>>();

  const saveFunc = useCallback(async () => {
    if (promise) {
      // TODO: Remove this fucking shit
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await promise;
    }
    setVal(values);
    setSubm(true);
    promise.current = save(values);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await promise;
    setSubm(false);
  }, [save, values]);

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
  }, [values, debounce, saveFunc]);

  return (
    <div className={s.inputs}>
      <Field name="search">
        {({ input, meta }) => (
          <>
            <Input
              {...input}
              StartAdornment={Search}
              className={s.modalInput}
              placeholder={t('common|Search')}
              error={meta.error}
              readOnly={values.token1 && values.token2}
            />
          </>
        )}
      </Field>
      {isSecondInput && (
        <Field name="tokenId" validate={validateMinMax(0, 100)}>
          {({ input, meta }) => (
            <NumberInput
              {...input}
              className={s.modalInput}
              placeholder={t('common|Token ID')}
              step={1}
              min={0}
              max={100}
              readOnly={values.token1 && values.token2}
              error={(meta.touched && meta.error) || meta.submitError}
              onIncrementClick={() => {
                form.mutators.setValue('tokenId', Math.min(Number(input.value) + 1, 100));
              }}
              onDecrementClick={() => {
                form.mutators.setValue('tokenId', Math.max(Number(input.value) - 1, 1));
              }}
            />
          )}
        </Field>
      )}
    </div>
  );
};
