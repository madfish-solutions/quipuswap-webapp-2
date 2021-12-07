import {
  batchify,
  estimateReward,
  findDex,
  FoundDex,
  getLiquidityShare,
  vetoCurrentBaker,
  voteForBaker,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {
  QSMainNet,
  VoterType,
  VoteFormValues,
  WhitelistedTokenPair,
  VotingMethod,
} from '@utils/types';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals, toDecimals } from '@utils/helpers';

export const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  setDex: (dex: FoundDex) => void,
  setRewards: (reward: string) => void,
  setVoter: (voter: VoterType) => any,
  updateToast: (err: any) => void,
  tezos?: TezosToolkit | null,
  accountPkh?: string | null,
  networkId?: QSMainNet,
) => {
  const asyncFunc = async () => {
    if (!tezos || !networkId) {
      setTokenPair(pair);
      return;
    }
    try {
      const secondAsset: { contract: string; id?: number } = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      setDex(foundDex);
      const asyncRewards = async () => {
        if (!accountPkh) return;
        const res = await estimateReward(tezos, foundDex, accountPkh);
        const rewards = fromDecimals(
          res,
          TEZOS_TOKEN.metadata.decimals,
        ).toString();
        setRewards(rewards);
      };
      asyncRewards();
      const asyncVoter = async () => {
        if (!accountPkh) return;
        const voter = await foundDex.storage.storage.voters.get(accountPkh);
        if (voter) {
          setVoter({
            veto: fromDecimals(voter.veto, TEZOS_TOKEN.metadata.decimals),
            candidate: voter.candidate,
            vote: fromDecimals(voter.vote, TEZOS_TOKEN.metadata.decimals),
          });
        } else setVoter({} as VoterType);
      };
      asyncVoter();
      let frozenBalance = '0';
      let totalBalance = '0';
      if (accountPkh) {
        const share = await getLiquidityShare(tezos, foundDex, accountPkh!!);

        frozenBalance = fromDecimals(
          share.frozen,
          TEZOS_TOKEN.metadata.decimals,
        ).toString();
        totalBalance = fromDecimals(
          share.total,
          TEZOS_TOKEN.metadata.decimals,
        ).toString();
      }
      const res = {
        ...pair,
        frozenBalance,
        balance: totalBalance,
        dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      updateToast(err);
    }
  };
  asyncFunc();
};

type SubmitProps = {
  tezos: TezosToolkit;
  values: VoteFormValues;
  dex?: FoundDex;
  tab: string;
  updateToast: any;
  handleErrorToast: (e: any) => void;
  getBalance: () => void;
};

interface IBatchParamsAndToastText {
  text: string;
  params: Array<TransferParams>;
}

const vote = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  baker: string,
  balance: number,
): Promise<IBatchParamsAndToastText> => {
  const text = 'Vote completed!';
  const params = await voteForBaker(
    tezos,
    dex,
    baker,
    toDecimals(new BigNumber(balance), TEZOS_TOKEN.metadata.decimals),
  );

  return {
    text,
    params,
  };
};

const unvote = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  baker: string,
): Promise<IBatchParamsAndToastText> => {
  const text = 'Unvote completed!';
  const params = await voteForBaker(tezos, dex, baker, new BigNumber(0));

  return {
    text,
    params,
  };
};

const veto = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  balance: number,
): Promise<IBatchParamsAndToastText> => {
  const text = 'Veto completed!';
  const params = await vetoCurrentBaker(
    tezos,
    dex,
    toDecimals(new BigNumber(balance), TEZOS_TOKEN.metadata.decimals),
  );

  return {
    text,
    params,
  };
};

const unveto = async (
  tezos: TezosToolkit,
  dex: FoundDex,
): Promise<IBatchParamsAndToastText> => {
  const text = 'Remove veto completed!';
  const params = await vetoCurrentBaker(tezos, dex, new BigNumber(0));

  return {
    text,
    params,
  };
};

const getBatchParamsAndToastText = async (
  tab: string,
  tezos: TezosToolkit,
  dex: FoundDex,
  values: VoteFormValues,
): Promise<IBatchParamsAndToastText> => {
  const { method, balance1, selectedBaker } = values;

  if (method === VotingMethod.FIRST) {
    if (tab === 'vote') {
      return vote(tezos, dex, selectedBaker, balance1);
    }
    return veto(tezos, dex, balance1);
  }
  if (tab === 'vote') {
    return unvote(tezos, dex, values.currentBacker!);
  }
  return unveto(tezos, dex);
};

export const submitForm = async ({
  tezos,
  values,
  dex,
  tab,
  handleErrorToast,
  updateToast,
  getBalance,
}: SubmitProps) => {
  if (!dex) return;

  try {
    const { params, text: updateToastText } = await getBatchParamsAndToastText(
      tab,
      tezos,
      dex,
      values,
    );

    const op = await batchify(tezos.wallet.batch([]), params).send();

    await op.confirmation();
    // handleSuccessToast();
    updateToast({
      type: 'success',
      render: updateToastText,
    });
    getBalance();
  } catch (e) {
    handleErrorToast(e);
  }
};

export const submitWithdraw = async (
  tezos: TezosToolkit,
  voteParams: TransferParams[],
  updateToast: (err: any) => void,
  handleSuccessToast: any,
  getBalance: () => void,
) => {
  try {
    const op = await batchify(tezos.wallet.batch([]), voteParams).send();
    await op.confirmation();
    handleSuccessToast();
    getBalance();
  } catch (e) {
    updateToast(e);
  }
};
