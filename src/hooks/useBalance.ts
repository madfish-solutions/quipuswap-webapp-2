import { useEffect, useState } from 'react';
import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { getLiquidityShare, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  getContract, useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { QSMainNet, WhitelistedFarm } from '@utils/types';
import { STABLE_TOKEN } from '@utils/defaults';
import { useExchangeRates } from '@hooks/useExchangeRate';

export const useBalance = (farm:WhitelistedFarm) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const networkId:QSMainNet = useNetwork().id as QSMainNet;
  const [balance, setBalances] = useState<BigNumber>(new BigNumber(0));

  useEffect(() => {
    const loadBalance = async () => {
      if (!tezos) return;
      if (!accountPkh) return;
      if (!farm) return;

      const asset:Token = {
        contract: farm.stakedToken.contractAddress,
        id: farm.stakedToken.fa2TokenId,
      };

      const dex = getContract(tezos, <string>asset.contract);

      const dexbuf = await Promise.resolve<ContractAbstraction<ContractProvider>>(dex);
      const share = await getLiquidityShare(tezos, dexbuf, accountPkh);

      const price = new BigNumber(exchangeRates && exchangeRates.find
        ? exchangeRates
          .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate
        : NaN);

      const balanceCalculated = share.total
        .dividedBy(1_000_000)
        .multipliedBy(price);

      setBalances(balanceCalculated);
    };

    if (accountPkh) {
      loadBalance();
    } else {
      setBalances(new BigNumber(0));
    }

    return () => setBalances(new BigNumber(0));
  }, [accountPkh, farm, tezos, exchangeRates, networkId]);

  return balance;
};
