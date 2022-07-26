import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import {
  Card,
  Button,
  Input,
  RadioButton,
  TokenInput,
  Iterator,
  AlarmMessage,
  ConnectWalletOrDoSomething
} from '@shared/components';
import { TokensModal } from '@shared/modals/tokens-modal';
import styles from '@styles/CommonContainer.module.scss';
import { i18n } from '@translation';

import { FormHeader } from '../../../../../components';
import { StableswapContentRoutes } from '../../../../../stableswap-routes.enum';
import { CreationCost, SelectTokensButton } from '../../components';
import createFormStyles from './create-form.module.scss';
import { useCreateFormViewModel } from './create-form.vm';

interface Props {
  subpath: StableswapContentRoutes;
}

export const CreateForm: FC<Props> = observer(({ subpath }) => {
  const {
    liquidityProvidersFeeInputParams,
    tokenInputsParams,
    radioButtonParams,
    creationPrice,
    tokensInputValidationMessage,
    handleSubmit,
    handleSelectTokensClick
  } = useCreateFormViewModel();

  return (
    <Card
      header={{
        content: <FormHeader subpath={subpath} />
      }}
      contentClassName={styles.content}
      data-test-id="stableswapCreateForm"
    >
      <TokensModal />
      <form className={createFormStyles.createForm} onSubmit={handleSubmit}>
        <SelectTokensButton onClick={handleSelectTokensClick} />

        {tokenInputsParams && <Iterator render={TokenInput} data={tokenInputsParams} />}

        {tokensInputValidationMessage && <AlarmMessage message={tokensInputValidationMessage} />}

        <h3>{i18n.t('stableswap|fees')}</h3>
        <Input {...liquidityProvidersFeeInputParams} />

        <h3>{i18n.t('stableswap|amplificationParameters')}</h3>
        <RadioButton {...radioButtonParams} />

        <div>
          <h3>{i18n.t('stableswap|cost')}</h3>
          <CreationCost total={creationPrice} />
        </div>

        <div className={createFormStyles.createButtonContainer}>
          <ConnectWalletOrDoSomething>
            <Button type="submit" className={createFormStyles.createButton}>
              {i18n.t('stableswap|create')}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </form>
    </Card>
  );
});
