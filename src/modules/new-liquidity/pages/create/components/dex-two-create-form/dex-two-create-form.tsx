import { FC } from 'react';

import {
  Button,
  ComplexBaker,
  ComplexBakerProps,
  ConnectWalletOrDoSomething,
  Iterator,
  TokenInput,
  TokenInputProps
} from '@shared/components';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './dex-two-create-form.module.scss';

interface BakerProps extends ComplexBakerProps {
  shouldShowBakerInput: boolean;
}

interface Props {
  data: TokenInputProps[];
  bakerData: BakerProps;
  onSubmit: () => void;
}

export const DexTwoCreateForm: FC<Props> = ({ data, onSubmit, bakerData }) => {
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
            className={stylesCommonContainer.button}
            disabled={false}
            loading={false}
            data-test-id="dexTwoCreatePoolButton"
          >
            {t('common|Create')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
