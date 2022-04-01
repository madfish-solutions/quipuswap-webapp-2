import { useCallback, FC } from 'react';

import { useTranslation } from 'next-i18next';
import { Field, FieldMetaState } from 'react-final-form';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Input, NumberInput } from '@shared/components';
import { parseNumber } from '@shared/helpers';
import { useSaveFunction } from '@shared/helpers/crutches';
import { Search } from '@shared/svg';
import { validateMinMaxNonStrict } from '@shared/validators';

import s from './PositionsModal.module.scss';
import { HeaderProps, PMFormField } from './PositionsModal.types';

export const Header: FC<HeaderProps> = ({ isSecondInput, debounce, save, values, form }) => {
  const { t } = useTranslation(['common']);

  useSaveFunction(save, values, debounce);

  const setFormValue = useCallback(
    (field: PMFormField, value: string | number) => form.mutators.setValue(field, value),
    [form]
  );

  const handleIncrement = (value: string) =>
    setFormValue(PMFormField.TOKEN_ID, Math.min(Number(value) + STEP, MAX_TOKEN_ID));
  const handleDecrement = (value: string) =>
    setFormValue(PMFormField.TOKEN_ID, Math.max(Number(value) - STEP, MIN_TOKEN_ID));

  const isError = (meta: FieldMetaState<string>) => (meta.touched && meta.error) || meta.submitError;

  return (
    <div className={s.inputs}>
      <Field name={PMFormField.SEARCH}>
        {({ input, meta }) => (
          <Input
            {...input}
            StartAdornment={Search}
            className={s.modalInput}
            placeholder={t('common|Search')}
            error={meta.error}
            readOnly={values[PMFormField.FIRST_TOKEN] && values[PMFormField.SECOND_TOKEN]}
          />
        )}
      </Field>
      {isSecondInput && (
        <Field
          name={PMFormField.TOKEN_ID}
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
