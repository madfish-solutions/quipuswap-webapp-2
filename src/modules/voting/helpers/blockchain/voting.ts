import { batchify, FoundDex, vetoCurrentBaker, voteForBaker } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN } from '@config/tokens';
import { VotingTabs } from '@modules/voting/tabs.enum';
import { toAtomic } from '@shared/helpers';
import { VoteFormValues } from '@shared/types';
import { UseToasts } from '@shared/utils';
import { useConfirmOperation } from '@shared/utils/confirm-operation';

interface SubmitProps {
  tezos: TezosToolkit;
  values: VoteFormValues;
  dex: FoundDex;
  tab: VotingTabs;
  confirmOperation: ReturnType<typeof useConfirmOperation>;
}

interface IBatchParamsAndToastText {
  text: string;
  params: Array<TransferParams>;
}

const vote = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  baker: string,
  balance: number
): Promise<IBatchParamsAndToastText> => {
  const text = 'Vote completed!';
  const params = await voteForBaker(tezos, dex, baker, toAtomic(new BigNumber(balance), TEZOS_TOKEN.metadata.decimals));

  return {
    text,
    params
  };
};

const unvote = async (tezos: TezosToolkit, dex: FoundDex, baker: string): Promise<IBatchParamsAndToastText> => {
  const text = 'Unvote completed!';
  const params = await voteForBaker(tezos, dex, baker, new BigNumber(0));

  return {
    text,
    params
  };
};

const veto = async (tezos: TezosToolkit, dex: FoundDex, balance: number): Promise<IBatchParamsAndToastText> => {
  const text = 'Veto completed!';
  const params = await vetoCurrentBaker(tezos, dex, toAtomic(new BigNumber(balance), TEZOS_TOKEN.metadata.decimals));

  return {
    text,
    params
  };
};

const unveto = async (tezos: TezosToolkit, dex: FoundDex): Promise<IBatchParamsAndToastText> => {
  const text = 'Remove veto completed!';
  const params = await vetoCurrentBaker(tezos, dex, new BigNumber(0));

  return {
    text,
    params
  };
};

export const unvoteOrUnveto = async (
  tab: VotingTabs,
  tezos: TezosToolkit,
  dex: FoundDex,
  baker?: string
): Promise<IBatchParamsAndToastText> => {
  if (tab === VotingTabs.vote && baker) {
    return unvote(tezos, dex, baker);
  }

  if (tab === VotingTabs.veto) {
    return unveto(tezos, dex);
  }

  throw Error('Something went wrong');
};

const getBatchParamsAndToastText = async (
  tab: VotingTabs,
  tezos: TezosToolkit,
  dex: FoundDex,
  values: VoteFormValues
): Promise<IBatchParamsAndToastText> => {
  const { balance1, selectedBaker } = values;

  if (tab === VotingTabs.vote) {
    return vote(tezos, dex, selectedBaker, balance1);
  }

  return veto(tezos, dex, balance1);
};

export const unvoteOrRemoveVeto = async (
  tab: VotingTabs,
  tezos: TezosToolkit,
  dex: FoundDex,
  showErrorToast: UseToasts['showErrorToast'],
  confirmOperation: ReturnType<typeof useConfirmOperation>,
  getBalance: () => void,
  baker: string
) => {
  try {
    const { params, text: updateToastText } = await unvoteOrUnveto(tab, tezos, dex, baker);
    const op = await batchify(tezos.wallet.batch([]), params).send();
    await confirmOperation(op.opHash, { message: updateToastText });
    getBalance();
  } catch (e) {
    showErrorToast(e as Error);
  }
};

export const submitForm = async ({ tezos, values, dex, tab, confirmOperation }: SubmitProps) => {
  const { params, text: updateToastText } = await getBatchParamsAndToastText(tab, tezos, dex, values);
  const op = await batchify(tezos.wallet.batch([]), params).send();
  await confirmOperation(op.opHash, { message: updateToastText });
};
