import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@api/get-user-balance';
import { getDepositAmount } from '@api/staking/get-deposit-amount.api';
import { getStakingItemApi } from '@api/staking/get-staking-item.api';
import { StakingTabs } from '@containers/staking/item/types';
import { RawStakingItem, StakingItem } from '@interfaces/staking.interfaces';
import { isNull } from '@utils/helpers';
import { balanceMap } from '@utils/mapping/balance.map';
import { mapStakeItem } from '@utils/mapping/staking.map';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const DEFAULT_INPUT_AMOUNT = 0;

export class StakingItemStore {
  stakingId: Nullable<BigNumber> = null;

  itemStore = new LoadingErrorData<RawStakingItem, Nullable<StakingItem>>(
    null,
    async () => await getStakingItemApi(this.stakingId, this.rootStore.authStore.accountPkh),
    mapStakeItem
  );

  availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserTokenBalance(),
    balance => balanceMap(balance, this.itemStore.data?.stakedToken)
  );

  depositBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserDepositBalance(),
    balance => balanceMap(balance, this.itemStore.data?.stakedToken)
  );

  currentTab: StakingTabs = StakingTabs.stake;

  inputAmount = new BigNumber(DEFAULT_INPUT_AMOUNT);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      inputAmount: observable,
      selectedBaker: observable,

      setTab: action,
      clearBalance: action,
      setInputAmount: action,
      setSelectedBaker: action
    });
    this.clearBalance();
  }

  setTab(tab: StakingTabs) {
    this.currentTab = tab;
  }

  setInputAmount(inputAmount: BigNumber.Value) {
    this.inputAmount = new BigNumber(inputAmount);
  }

  setSelectedBaker(selectedBaker: Nullable<WhitelistedBaker>) {
    this.selectedBaker = selectedBaker;
  }

  clearBalance() {
    this.setInputAmount(DEFAULT_INPUT_AMOUNT);
  }

  setStakingId(stakingId: Nullable<BigNumber>) {
    this.stakingId = stakingId;
  }

  private async getUserTokenBalance() {
    if (isNull(this.rootStore.tezos) || isNull(this.rootStore.authStore.accountPkh) || isNull(this.itemStore.data)) {
      return null;
    }

    return getUserTokenBalance(
      this.rootStore.tezos,
      this.rootStore.authStore.accountPkh,
      this.itemStore.data?.stakedToken
    );
  }

  private async getUserDepositBalance() {
    if (
      isNull(this.rootStore.tezos) ||
      isNull(this.rootStore.authStore.accountPkh) ||
      isNull(this.itemStore.data) ||
      isNull(this.stakingId)
    ) {
      return null;
    }

    return await getDepositAmount(this.rootStore.tezos, this.stakingId, this.rootStore.authStore.accountPkh);
  }
}
