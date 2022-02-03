import React, { useCallback } from 'react';

import { Input, NumberInput, Search } from '@quipuswap/ui-kit';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { Field } from 'react-final-form';

import s from '@components/modals/TokensModal/TokensModal.module.sass';
import { parseNumber } from '@utils/helpers';
import { validateMinMaxNonStrict } from '@utils/validators';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '../constants';
import { useSaveFunction } from '../use-save-function';
import { FormValues, TokensModalFormField } from './types';

export interface HeaderProps {
  isSecondInput: boolean;
  debounce: number;
  save: never;
  values: never;
  form: FormApi<FormValues, Partial<FormValues>>;
}

export const Header: React.FC<HeaderProps> = ({ isSecondInput, debounce, save, values, form }) => {
  const { t } = useTranslation(['common']);

  useSaveFunction(save, values, debounce);

  const setFormValue = useCallback(
    (field: TokensModalFormField, value: string | number) => form.mutators.setValue(field, value),
    [form]
  );

  return (
    <div className={s.inputs}>
      <Field name={TokensModalFormField.SEARCH}>
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
          name={TokensModalFormField.TOKEN_ID}
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
                setFormValue(TokensModalFormField.TOKEN_ID, Math.min(Number(input.value) + STEP, MAX_TOKEN_ID));
              }}
              onDecrementClick={() => {
                setFormValue(TokensModalFormField.TOKEN_ID, Math.max(Number(input.value) - STEP, MIN_TOKEN_ID));
              }}
            />
          )}
        </Field>
      )}
    </div>
  );
};
