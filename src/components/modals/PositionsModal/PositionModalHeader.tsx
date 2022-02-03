import React, { useCallback } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';
import { Field } from 'react-final-form';

import { parseNumber } from '@utils/helpers';
import { validateMinMaxNonStrict } from '@utils/validators';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '../constants';
import { useSaveFunction } from '../use-save-function';
import s from './PositionsModal.module.sass';
import { HeaderProps, PositionsModalFormField } from './PositionsModal.types';

export const Header: React.FC<HeaderProps> = ({ isSecondInput, debounce, save, values, form }) => {
  const { t } = useTranslation(['common']);

  useSaveFunction(save, values, debounce);

  const setFormValue = useCallback(
    (field: PositionsModalFormField, value: string | number) => form.mutators.setValue(field, value),
    [form]
  );

  return (
    <div className={s.inputs}>
      <Field name={PositionsModalFormField.SEARCH}>
        {({ input, meta }) => (
          <Input
            {...input}
            StartAdornment={Search}
            className={s.modalInput}
            placeholder={t('common|Search')}
            error={meta.error}
            readOnly={values.token1 && values.token2}
          />
        )}
      </Field>
      {isSecondInput && (
        <Field
          name={PositionsModalFormField.TOKEN_ID}
          validate={validateMinMaxNonStrict(MIN_TOKEN_ID, MAX_TOKEN_ID)}
          parse={value => parseNumber(value, MIN_TOKEN_ID, MAX_TOKEN_ID)}
        >
          {({ input, meta }) => (
            <NumberInput
              {...input}
              className={s.modalInput}
              placeholder={t('common|Token ID')}
              step={STEP}
              min={MIN_TOKEN_ID}
              max={MAX_TOKEN_ID}
              error={(meta.touched && meta.error) || meta.submitError}
              onIncrementClick={() => {
                setFormValue(PositionsModalFormField.TOKEN_ID, Math.min(Number(input.value), MAX_TOKEN_ID));
              }}
              onDecrementClick={() => {
                setFormValue(PositionsModalFormField.TOKEN_ID, Math.max(Number(input.value), MIN_TOKEN_ID));
              }}
            />
          )}
        </Field>
      )}
    </div>
  );
};
