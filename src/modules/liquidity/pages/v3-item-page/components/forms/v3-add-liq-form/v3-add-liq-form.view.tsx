import { FC } from 'react';

import { Button, ConnectWalletOrDoSomething, Iterator, TokenInput, TokenInputProps } from '@shared/components';
import { WarningAlert } from '@shared/components/warning-alert';
import { Plus } from '@shared/svg';
import { Nullable } from '@shared/types';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './v3-add-liq-form.module.scss';

interface Props {
  data: TokenInputProps[];
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
  warningMessage: Nullable<string>;
}

export const V3AddLiqFormView: FC<Props> = ({ data, onSubmit, disabled, isSubmitting, warningMessage }) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
      <WarningAlert message={warningMessage} className={stylesCommonContainer.mt24} />
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="V3AddLiqButton"
          >
            {t('common|Add')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
