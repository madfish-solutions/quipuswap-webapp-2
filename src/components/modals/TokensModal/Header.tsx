import { FC, useCallback } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { Field, FieldMetaState } from 'react-final-form';

import s from '@components/modals/TokensModal/TokensModal.module.sass';
import { parseNumber } from '@utils/helpers';
import { validateMinMaxNonStrict } from '@utils/validators';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '../constants';
import { useSaveFunction } from '../use-save-function';
import { FormValues, TMFormField } from './types';

export interface HeaderProps {
  isSecondInput: boolean;
  debounce: number;
  save: never;
  values: never;
  form: FormApi<FormValues, Partial<FormValues>>;
}

export const Header: FC<HeaderProps> = ({ isSecondInput, debounce, save, values, form }) => {
  const { t } = useTranslation(['common']);

  useSaveFunction(save, values, debounce);

  const setFormValue = useCallback(
    (field: TMFormField, value: string | number) => form.mutators.setValue(field, value),
    [form]
  );

  const handleIncrement = (value: string) =>
    setFormValue(TMFormField.TOKEN_ID, Math.min(Number(value) + STEP, MAX_TOKEN_ID));
  const handleDecrement = (value: string) =>
    setFormValue(TMFormField.TOKEN_ID, Math.max(Number(value) - STEP, MIN_TOKEN_ID));

  const isError = (meta: FieldMetaState<string>) => (meta.touched && meta.error) || meta.submitError;

  return (
    <div className={s.inputs}>
      <Field name={TMFormField.SEARCH}>
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
        <Field
          name={TMFormField.TOKEN_ID}
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
              error={isError(meta)}
              onIncrementClick={() => handleIncrement(input.value)}
              onDecrementClick={() => handleDecrement(input.value)}
            />
          )}
        </Field>
      )}
    </div>
  );
};
