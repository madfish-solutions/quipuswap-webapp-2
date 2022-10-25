import { FC } from 'react';

import {
  AlarmMessage,
  Button,
  ComplexBaker,
  ComplexBakerProps,
  ConnectWalletOrDoSomething,
  Iterator,
  TokenInput,
  TokenInputProps
} from '@shared/components';
import { isExist } from '@shared/helpers';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { NewLiquidityPoolExist } from '../new-liquidity-pool-exist';
import styles from './dex-two-create-form.module.scss';

interface BakerProps extends ComplexBakerProps {
  shouldShowBakerInput: boolean;
}

interface CommonData {
  disabled: boolean;
  loading: boolean;
  isPoolExist: boolean;
}

interface Props {
  data: TokenInputProps[];
  bakerData: BakerProps;
  commonData: CommonData;
  onSubmit: () => void;
}

export const DexTwoCreateForm: FC<Props> = ({ data, onSubmit, bakerData, commonData }) => {
  const { t } = useTranslation();

  const { disabled, loading, isPoolExist } = commonData;
  const { value, error, handleChange, shouldShowBakerInput } = bakerData;

  const tokens = data
    .map(inputValue => inputValue.tokens)
    .flat()
    .filter(isExist);

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
          <NewLiquidityPoolExist className={styles.poolExistWarning} tokens={tokens} />
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
