import { FC } from 'react';

import { FormApi, Mutator } from 'final-form';
import { withTypes } from 'react-final-form';

import { isNull } from '@utils/helpers';
import { StakeFormValues, Nullable } from '@utils/types';

import { bakerCleaner } from '../../helpers';
import { useStakingHandlers, useStakingRouting } from '../../helpers/staking.provider';
import { useHandleStake } from '../../hooks';
import { StakingTabs } from '../../types';
import { StakingForm } from './staking-form';

// TODO: Refactor solution of BakerCleaner

interface pForm {
  form: Nullable<FormApi<StakeFormValues, Partial<StakeFormValues>>>;
}

const pointerForm: pForm = { form: null };
const BALANCE1 = 'balance1';
const SELECTED_BAKER = 'selectedBaker';

const cleanUp = (tab: StakingTabs) => {
  if (!isNull(pointerForm.form)) {
    pointerForm.form.mutators.setValue(BALANCE1, null);
    if (tab === StakingTabs.stake) {
      pointerForm.form.mutators.setValue(SELECTED_BAKER, null);
      bakerCleaner.run();
    }
  }
};

export const WrappedStakingForm: FC = () => {
  const { Form } = withTypes<StakeFormValues>();

  const { updateBalances } = useStakingHandlers();

  const handleStake = useHandleStake();

  const { currentTab } = useStakingRouting();

  const handleStakeSubmit = async (values: StakeFormValues) => {
    await handleStake(values);
    updateBalances();
    cleanUp(currentTab.id);
  };

  const mutators: { [key: string]: Mutator<StakeFormValues, Partial<StakeFormValues>> } = {
    setValue: ([field, value], state, { changeValue }) => {
      changeValue(state, field, () => value);
    }
  };

  const handleFormRender = (handleSubmit: () => Promise<void>, form: FormApi<StakeFormValues>) => {
    if (pointerForm.form !== form) {
      pointerForm.form = form;
    }

    return <StakingForm form={form} handleSubmit={handleSubmit} bakerCleaner={bakerCleaner} />;
  };

  return (
    <Form
      onSubmit={handleStakeSubmit}
      mutators={mutators}
      render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
    />
  );
};
