import React from 'react';
import { Field } from 'react-final-form';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import s from '@styles/CommonContainer.module.sass';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { isAddress } from '@utils/validators';

interface SwapFormSendArgs {
  form: any;
  currentTab: any;
}

export const SwapFormSend: React.FC<SwapFormSendArgs> = ({ form, currentTab }) => {
  const { t } = useTranslation(['swap']);
  return (
    <Field validate={currentTab.id === 'send' ? isAddress : () => undefined} name="recipient">
      {({ input, meta }) => (
        <>
          {currentTab.id === 'send' && (
            <ComplexRecipient
              {...input}
              handleInput={(value) => {
                form.mutators.setValue('recipient', value);
              }}
              label={t('swap|Recipient address')}
              id="swap-send-recipient"
              className={cx(s.input, s.mb24)}
              error={(meta.touched && meta.error) || meta.submitError}
            />
          )}
        </>
      )}
    </Field>
  );
};
