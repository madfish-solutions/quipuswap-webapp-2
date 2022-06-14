import { FC } from 'react';

import { FormikErrors, FormikTouched } from 'formik';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Search } from '@shared/svg';
import { useTranslation } from '@translation';

import { Input } from '../input';
import { NumberInput } from '../number-input';
import s from './tokens-modal.module.scss';
import { FormValues, TMFormField } from './types';

export interface HeaderProps {
  errors: FormikErrors<Partial<FormValues>>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onTokenIdDecrement: () => void;
  onTokenIdIncrement: () => void;
  isSecondInput: boolean;
  touched: FormikTouched<Partial<FormValues>>;
  values: Partial<FormValues>;
}

export const Header: FC<HeaderProps> = ({
  errors,
  isSecondInput,
  onChange,
  onTokenIdDecrement,
  onTokenIdIncrement,
  touched,
  values
}) => {
  const { t } = useTranslation(['common']);

  const isError = (fieldName: TMFormField) => (touched[fieldName] ? errors[fieldName] : undefined);

  return (
    <div className={s.inputs}>
      <Input
        name={TMFormField.SEARCH}
        onChange={onChange}
        value={values[TMFormField.SEARCH]}
        StartAdornment={Search}
        className={s.modalInput}
        placeholder={t('common|Search')}
        error={isError(TMFormField.SEARCH)}
        autoFocus
      />
      {isSecondInput && (
        <NumberInput
          name={TMFormField.TOKEN_ID}
          onChange={onChange}
          value={values[TMFormField.TOKEN_ID]}
          className={s.modalInput}
          placeholder={t('common|Token ID')}
          step={STEP}
          min={MIN_TOKEN_ID}
          max={MAX_TOKEN_ID}
          error={isError(TMFormField.TOKEN_ID)}
          onIncrementClick={onTokenIdIncrement}
          onDecrementClick={onTokenIdDecrement}
        />
      )}
    </div>
  );
};
