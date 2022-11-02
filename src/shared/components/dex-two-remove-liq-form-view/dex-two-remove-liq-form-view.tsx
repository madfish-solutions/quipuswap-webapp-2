import { FC } from 'react';

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
  lpData: TokenInputProps;
}

export const DexTwoRemoveLiqFormView: FC<Props> = ({ data, onSubmit, lpData }) => {
  const { t } = useTranslation();

  const { value, label, error, balance, tokens, onInputChange } = lpData;

  return (
    <form onSubmit={onSubmit}>
      <TokenInput
        value={value}
        label={label}
        error={error}
        balance={balance}
        tokens={tokens}
        onInputChange={onInputChange}
        id="dex-two-remove-liq-form"
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
            data-test-id="dexTwoRemoveLiqButton"
          >
            {t('common|Remove')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
