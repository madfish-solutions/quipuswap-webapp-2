import { FC } from 'react';

import { FormApi, Mutator } from 'final-form';
import { observer } from 'mobx-react-lite';
import { withTypes } from 'react-final-form';

import { StakeFormSpy } from '@containers/stake/item/components/staking-form/stake-form/stake-form-spy';
import { StakeFormValues } from '@containers/stake/item/components/staking-form/stake-form/stake-form-values.interface';
import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';
import { Nullable } from '@utils/types';

// TODO: Refactor solution of BakerCleaner

interface IForm {
  form: Nullable<FormApi<StakeFormValues, Partial<StakeFormValues>>>;
}

const pointerForm: IForm = { form: null };

export const StakeForm: FC = observer(() => {
  const { Form } = withTypes<StakeFormValues>();

  const stakingFormStore = useStakingFormStore();

  const handleStakeSubmit = async (values: StakeFormValues) => {
    // eslint-disable-next-line no-console
    console.log('submit', values);
    await stakingFormStore.stake();
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

    return <StakeFormSpy form={form} handleSubmit={handleSubmit} />;
  };

  return (
    <Form
      onSubmit={handleStakeSubmit}
      mutators={mutators}
      render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
    />
  );
});
