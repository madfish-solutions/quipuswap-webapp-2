import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getFarmingItemApi } from '@api/farming/get-farming-item.api';
import { getLastStakedTime } from '@api/farming/get-last-staked-time.api';
import { getUserFarmingDelegate } from '@api/farming/get-user-farming-delegate.api';
import { getUserTokenBalance } from '@api/get-user-balance';
import { StakingTabs } from '@containers/farming/item/types';
import { RawFarmingItem, FarmingItem } from '@interfaces/farming.interfaces';
import { isNull } from '@utils/helpers';
import { balanceMap } from '@utils/mapping/balance.map';
import { mapFarmItem } from '@utils/mapping/farming.map';
import { noopMap } from '@utils/mapping/noop.map';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const DEFAULT_INPUT_AMOUNT = 0;

export class FarmingItemStore {
  farmingId: Nullable<BigNumber> = null;

  itemStore = new LoadingErrorData<RawFarmingItem, Nullable<FarmingItem>>(
    null,
    async () => await getFarmingItemApi(this.farmingId, this.rootStore.authStore, this.rootStore.tezos),
    mapFarmItem
  );

  availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserTokenBalance(),
    balance => balanceMap(balance, this.itemStore.data?.stakedToken)
  );

  lastStakedTimeStore = new LoadingErrorData<Nullable<number>, Nullable<number>>(
    null,
    async () => await this.getLastStakedTime(),
    noopMap
  );

  userStakingDelegateStore = new LoadingErrorData<Nullable<string>, Nullable<string>>(
    null,
    async () => await this.getUserStakingDelegate(),
    noopMap
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

  setFarmingId(farmingId: Nullable<BigNumber>) {
    this.farmingId = farmingId;
  }

  private async getUserTokenBalance() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getUserTokenBalance(tezos, authStore.accountPkh, item.stakedToken);
  }

  private async getLastStakedTime() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getLastStakedTime(tezos, authStore.accountPkh, item.id);
  }

  private async getUserStakingDelegate() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getUserFarmingDelegate(tezos, authStore.accountPkh, item.id);
  }
}
