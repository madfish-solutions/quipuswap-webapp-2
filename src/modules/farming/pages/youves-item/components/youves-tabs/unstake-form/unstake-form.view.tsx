import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { noop } from 'rxjs';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { UnstakeFormProps } from './unstake-form-props.interface';

export const UnstakeFormView: FC<UnstakeFormProps> = observer(
  ({ inputAmount, isSubmitting, balance, handleSubmit, disabled, tokens }) => {
    const { t } = useTranslation();

    return (
      <form onSubmit={handleSubmit}>
        <TokenInput
          id="unstake-form"
          label={t('common|Amount')}
          value={inputAmount}
          tokens={tokens}
          onInputChange={noop}
          disabled={disabled}
          balance={balance}
          readOnly
        />

        <div className={s.buttons}>
          <ConnectWalletOrDoSomething>
            <Button
              type="submit"
              className={s.button}
              disabled={disabled}
              loading={isSubmitting}
              data-test-id="unstakeButton"
            >
              {t('farm|Unstake')}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </form>
    );
  }
);
