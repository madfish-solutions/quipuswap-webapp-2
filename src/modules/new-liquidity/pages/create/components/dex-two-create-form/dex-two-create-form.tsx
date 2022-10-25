import { FC } from 'react';

import {
  AlarmMessage,
  Button,
  ComplexBaker,
  ConnectWalletOrDoSomething,
  Iterator,
  TokenInput
} from '@shared/components';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { NewLiquidityPoolExist } from '../new-liquidity-pool-exist';
import styles from './dex-two-create-form.module.scss';
import { DexTwoCreateFormProps } from './dex-two-create-form.types';

export const DexTwoCreateForm: FC<DexTwoCreateFormProps> = ({ data, onSubmit, bakerData, commonData }) => {
  const { t } = useTranslation();

  const { disabled, loading, isPoolExist, existingPoolLink } = commonData;
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
      {isPoolExist && (
        <AlarmMessage className={styles['mt-24']}>
          <NewLiquidityPoolExist className={styles.poolExistWarning} existingPoolLink={existingPoolLink} />
        </AlarmMessage>
      )}
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={disabled}
            loading={loading}
            data-test-id="dexTwoCreatePoolButton"
          >
            {t('common|Create')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
