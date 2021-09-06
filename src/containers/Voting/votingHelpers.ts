import {
  batchify,
  estimateReward, findDex, FoundDex, getLiquidityShare,
} from '@quipuswap/sdk';
import { TezosToolkit, TransferParams } from '@taquito/taquito';

import { QSMainNet, VoterType, WhitelistedTokenPair } from '@utils/types';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';

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
      const secondAsset = {
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
            veto: fromDecimals(voter.veto, TEZOS_TOKEN.metadata.decimals).toString(),
            candidate: voter.candidate,
            vote: fromDecimals(voter.vote, TEZOS_TOKEN.metadata.decimals).toString(),
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
      console.log(res);
      setTokenPair(res);
    } catch (err) {
      updateToast(err);
    }
  };
  asyncFunc();
};

export const submitForm = async (
  tezos:TezosToolkit,
  voteParams:TransferParams[],
  updateToast: (err:any) => void,
  handleSuccessToast:any,
) => {
  try {
    const op = await batchify(
      tezos.wallet.batch([]),
      voteParams,
    ).send();
    await op.confirmation();
    handleSuccessToast();
  } catch (e) {
    updateToast(e);
  }
};

export const submitWithdraw = async (
  tezos:TezosToolkit,
  voteParams:TransferParams[],
  updateToast: (err:any) => void,
  handleSuccessToast:any,
) => {
  try {
    const op = await batchify(
      tezos.wallet.batch([]),
      voteParams,
    ).send();
    await op.confirmation();
    handleSuccessToast();
  } catch (e) {
    updateToast(e);
  }
};
