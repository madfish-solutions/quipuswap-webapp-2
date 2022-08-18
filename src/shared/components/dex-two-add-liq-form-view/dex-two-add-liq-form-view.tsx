import { FC } from 'react';

import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { ConnectWalletOrDoSomething } from '../connect-wallet-or-do-something';
import { Iterator } from '../iterator';
import { TokenInput, TokenInputProps } from '../token-input';
import styles from './dex-two-add-liq-form-view.module.scss';

interface Props {
  data: TokenInputProps[];
  onSubmit: () => void;
}

export const DexTwoAddLiqFormView: FC<Props> = ({ data, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={false}
            loading={false}
            data-test-id="dexTwoAddLiqButton"
          >
            {t('common|Add')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
