import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card, Button, Input, RadioButton, TokenInput, Iterator } from '@shared/components';
import { TokensModal } from '@shared/modals/tokens-modal';
import styles from '@styles/CommonContainer.module.scss';
import { i18n } from '@translation';

import { FormHeader } from '../../../../../components';
import { StableswapContentRoutes } from '../../../../../stableswap-routes.enum';
import { CreationCost, SelectTokensButton } from '../../components';
import createFormstyles from './create-form.module.scss';
import { useCreateFormViewModel } from './create-form.vm';

interface Props {
  subpath: StableswapContentRoutes;
}

export const CreateForm: FC<Props> = observer(({ subpath }) => {
  const {
    handleSelectTokensClick,
    radioButtonValue,
    handleRadioButtonChange,
    tokenInputsParams,
    handleSubmit,
    radioButtonValues,
    creationCost
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
      <form className={createFormstyles.createForm} onSubmit={handleSubmit}>
        <SelectTokensButton onClick={handleSelectTokensClick} />
        {tokenInputsParams && <Iterator render={TokenInput} data={tokenInputsParams} />}

        <h3>{i18n.t('stableswap|fees')}</h3>
        <Input label={i18n.t('stableswap|liquidityProvidersFee')} />
        {/* <Input label={i18n.t('stableswap|interfaceOrReferralFee')} /> */}

        <h3>{i18n.t('stableswap|amplificationParameters')}</h3>
        <RadioButton onChange={handleRadioButtonChange} value={radioButtonValue} values={radioButtonValues} />

        <h3>{i18n.t('stableswap|cost')}</h3>
        <CreationCost {...creationCost} />

        <div className={createFormstyles.createButtonContainer}>
          <Button type="submit" className={createFormstyles.createButton}>
            {i18n.t('stableswap|create')}
          </Button>
        </div>
      </form>
    </Card>
  );
});
