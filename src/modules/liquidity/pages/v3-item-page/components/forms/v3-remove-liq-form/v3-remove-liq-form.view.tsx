import { FC } from 'react';

import { Button, ConnectWalletOrDoSomething, Iterator, TokenInput, TokenInputProps } from '@shared/components';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './v3-remove-liq-form.module.scss';

interface Props {
  data: TokenInputProps[];
  onSubmit: () => void;
}

export const V3RemoveLiqFormView: FC<Props> = ({ data, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <>
      <form onSubmit={onSubmit}>
        <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
        <div className={stylesCommonContainer.buttons}>
          <ConnectWalletOrDoSomething>
            <Button
              type="submit"
              className={stylesCommonContainer.button}
              disabled={false}
              loading={false}
              data-test-id="V3AddLiqButton"
            >
              {t('common|Add')}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </form>
    </>
  );
};
