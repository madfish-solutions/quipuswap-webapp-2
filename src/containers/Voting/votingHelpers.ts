import {
  batchify,
  estimateReward, findDex, FoundDex, getLiquidityShare, vetoCurrentBaker, voteForBaker,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {
  QSMainNet, VoteFormValues, VoterType, WhitelistedTokenPair,
} from '@utils/types';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals, toDecimals } from '@utils/helpers';

export const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  setDex: (dex: FoundDex) => void,
  setRewards: (reward: string) => void,
  setVoter: (voter: VoterType) => any,
  updateToast: (err:any) => void,
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
      const secondAsset: { contract: string, id?: number } = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      setDex(foundDex);
      const asyncRewards = async () => {
        if (!accountPkh) return;
        const res = await estimateReward(tezos, foundDex, accountPkh);
        const rewards = fromDecimals(res, TEZOS_TOKEN.metadata.decimals).toString();
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

        frozenBalance = fromDecimals(share.frozen, TEZOS_TOKEN.metadata.decimals).toString();
        totalBalance = fromDecimals(share.total, TEZOS_TOKEN.metadata.decimals).toString();
      }
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      updateToast(err);
    }
  };
  asyncFunc();
};

type SubmitProps = {
  tezos:TezosToolkit,
  values:VoteFormValues,
  dex?: FoundDex,
  tab: string,
  updateToast:any,
  handleErrorToast:(e:any) => void,
  getBalance:() => void,
};

export const submitForm = async ({
  tezos,
  values,
  dex,
  tab,
  handleErrorToast,
  updateToast,
  getBalance,
}:SubmitProps) => {
  let params:TransferParams[] = [];
  const { method, balance1, selectedBaker } = values;
  if (!dex) return;
  let updateToastText = '';
  if (method !== 'first') {
    try {
      if (tab === 'vote') {
        updateToastText = 'Vote completed!';
        params = await voteForBaker(
          tezos,
          dex,
          selectedBaker,
          toDecimals(new BigNumber(balance1), TEZOS_TOKEN.metadata.decimals),
        );
      } else {
        updateToastText = 'Veto completed!';
        params = await vetoCurrentBaker(
          tezos,
          dex,
          toDecimals(new BigNumber(balance1), TEZOS_TOKEN.metadata.decimals),
        );
      }
    } catch (e) {
      handleErrorToast(e);
    }
  } else {
    try {
      if (tab === 'vote') {
        updateToastText = 'Unvote completed!';
        params = await voteForBaker(tezos, dex, values.selectedBaker, new BigNumber(0));
      } else {
        updateToastText = 'Remove veto completed!';
        params = await vetoCurrentBaker(tezos, dex, new BigNumber(0));
      }
    } catch (e) {
      handleErrorToast(e);
    }
  }
  try {
    const op = await batchify(
      tezos.wallet.batch([]),
      params,
    ).send();
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
  tezos:TezosToolkit,
  voteParams:TransferParams[],
  updateToast: (err:any) => void,
  handleSuccessToast:any,
  getBalance:() => void,
) => {
  try {
    const op = await batchify(
      tezos.wallet.batch([]),
      voteParams,
    ).send();
    await op.confirmation();
    handleSuccessToast();
    getBalance();
  } catch (e) {
    updateToast(e);
  }
};
