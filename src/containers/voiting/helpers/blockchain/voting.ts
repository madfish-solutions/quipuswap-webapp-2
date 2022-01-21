import { batchify, FoundDex, vetoCurrentBaker, voteForBaker } from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN } from '@app.config';
import { VotingTabs } from '@containers/voiting/tabs.enum';
import { UseToasts } from '@hooks/use-toasts';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { toDecimals } from '@utils/helpers';
import { Nullable, VoteFormValues } from '@utils/types';

interface SubmitProps {
  tezos: TezosToolkit;
  values: VoteFormValues;
  dex: Nullable<FoundDex>;
  tab: VotingTabs;
  confirmOperation: ReturnType<typeof useConfirmOperation>;
  showErrorToast: UseToasts['showErrorToast'];
  getBalance: () => void;
  cleanUp: () => void;
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
  const params = await voteForBaker(
    tezos,
    dex,
    baker,
    toDecimals(new BigNumber(balance), TEZOS_TOKEN.metadata.decimals)
  );

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
  const params = await vetoCurrentBaker(tezos, dex, toDecimals(new BigNumber(balance), TEZOS_TOKEN.metadata.decimals));

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

export const submitForm = async ({
  tezos,
  values,
  dex,
  tab,
  showErrorToast,
  confirmOperation,
  getBalance,
  cleanUp
}: SubmitProps) => {
  if (!dex) {
    return;
  }

  try {
    const { params, text: updateToastText } = await getBatchParamsAndToastText(tab, tezos, dex, values);

    const op = await batchify(tezos.wallet.batch([]), params).send();

    await confirmOperation(op.opHash, { message: updateToastText });
    getBalance();
    cleanUp();
  } catch (e) {
    showErrorToast(e as Error);
  }
};
