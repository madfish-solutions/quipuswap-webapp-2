import { FC } from 'react';

import { FormApi, Mutator } from 'final-form';
import { withTypes } from 'react-final-form';

import { useVotingHandlers, useVotingRouting } from '@modules/voting/helpers/voting.provider';
import { useHandleVote } from '@modules/voting/hooks';
import { VotingTabs } from '@modules/voting/tabs.enum';
import { isNull } from '@shared/helpers';
import { VoteFormValues, Nullable } from '@shared/types';

import { VotingForm } from './voting-form';

// TODO: Refactor solution of BakerCleaner

interface pForm {
  form: Nullable<FormApi<VoteFormValues, Partial<VoteFormValues>>>;
}

const pointerForm: pForm = { form: null };
const BALANCE1 = 'balance1';
const SELECTED_BAKER = 'selectedBaker';

const cleanUp = (tab: VotingTabs) => {
  if (!isNull(pointerForm.form)) {
    pointerForm.form.mutators.setValue(BALANCE1, null);
    if (tab === VotingTabs.vote) {
      pointerForm.form.mutators.setValue(SELECTED_BAKER, null);
    }
  }
};

export const WrappedVotingForm: FC = () => {
  const { Form } = withTypes<VoteFormValues>();

  const { updateBalances } = useVotingHandlers();

  const handleVote = useHandleVote();

  const { currentTab } = useVotingRouting();

  const handleVoteSubmit = async (values: VoteFormValues) => {
    await handleVote(values);
    updateBalances();
    cleanUp(currentTab.id);
  };

  const mutators: { [key: string]: Mutator<VoteFormValues, Partial<VoteFormValues>> } = {
    setValue: ([field, value], state, { changeValue }) => {
      changeValue(state, field, () => value);
    }
  };

  const handleFormRender = (handleSubmit: () => Promise<void>, form: FormApi<VoteFormValues>) => {
    if (pointerForm.form !== form) {
      pointerForm.form = form;
    }

    return <VotingForm form={form} handleSubmit={handleSubmit} />;
  };

  return (
    <Form
      onSubmit={handleVoteSubmit}
      mutators={mutators}
      render={({ handleSubmit, form }) => handleFormRender(handleSubmit as () => Promise<void>, form)}
    />
  );
};
