import { FC } from 'react';

import { Button, ConnectWalletOrDoSomething, Iterator, TokenInput, TokenInputProps } from '@shared/components';
import { Plus, ArrowDown } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './v3-remove-liq-form.module.scss';

interface Props {
  lpData: TokenInputProps;
  data: TokenInputProps[];
  onSubmit: () => void;
}

export const V3RemoveLiqFormView: FC<Props> = ({ data, lpData, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <>
      <form onSubmit={onSubmit}>
        <TokenInput {...lpData} />
        <ArrowDown className={styles.svg} />
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
