import { FC } from 'react';

import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { ComplexBaker, ComplexBakerProps } from '../ComplexInput';
import { ConnectWalletOrDoSomething } from '../connect-wallet-or-do-something';
import { Iterator } from '../iterator';
import { TokenInput, TokenInputProps } from '../token-input';
import styles from './dex-two-add-liq-form-view.module.scss';

interface BakerProps extends ComplexBakerProps {
  shouldShowBakerInput: boolean;
}

interface Props {
  data: TokenInputProps[];
  bakerData: BakerProps;
  onSubmit: () => void;
  canMigrateLiquidity?: boolean;
  onMigrateLiquidity?: () => void;
}

export const DexTwoAddLiqFormView: FC<Props> = ({
  data,
  onSubmit,
  bakerData,
  canMigrateLiquidity,
  onMigrateLiquidity
}) => {
  const { t } = useTranslation();

  const { value, error, handleChange, shouldShowBakerInput } = bakerData;

  return (
    <form onSubmit={onSubmit}>
      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
      {shouldShowBakerInput && (
        <ComplexBaker
          value={value}
          error={error}
          handleChange={handleChange}
          label={t('common|Baker')}
          className={stylesCommonContainer.mt24}
        />
      )}
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            theme={canMigrateLiquidity ? 'secondary' : 'primary'}
            className={stylesCommonContainer.button}
            disabled={false}
            loading={false}
            data-test-id="dexTwoAddLiqButton"
          >
            {t('common|Add')}
          </Button>
          {canMigrateLiquidity && (
            <Button theme="primary" type="button" onClick={onMigrateLiquidity}>
              {t('newLiquidity|migrate')}
            </Button>
          )}
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
