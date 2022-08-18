import { FC } from 'react';

import { StableLpInput } from '@modules/new-liquidity/components';
import { ArrowDown, Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { ConnectWalletOrDoSomething } from '../connect-wallet-or-do-something';
import { Iterator } from '../iterator';
import { TokenInput, TokenInputProps } from '../token-input';
import styles from './dex-two-remove-liq-form-view.module.scss';

interface Props {
  data: TokenInputProps[];
  onSubmit: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lpData: any;
}

export const DexTwoRemoveLiqFormView: FC<Props> = ({ data, onSubmit, lpData }) => {
  const { t } = useTranslation();

  const { disabled, formik, label, balance, onInputChange } = lpData;

  return (
    <form onSubmit={onSubmit}>
      <StableLpInput
        disabled={disabled}
        formik={formik}
        label={label}
        balance={balance}
        onInputChange={onInputChange}
      />

      <ArrowDown className={styles.svg} />
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
