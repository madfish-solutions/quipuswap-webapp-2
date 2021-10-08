import { useEffect, useState } from 'react';
import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { getLiquidityShare, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  getContract, useAccountPkh, useFarms, useNetwork, useTezos,
} from '@utils/dapp';
import { QSMainNet } from '@utils/types';
import { useExchangeRates } from '@hooks/useExchangeRate';

export const useBalance = () => {
  const tezos = useTezos();
  const { data: farms } = useFarms();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const networkId:QSMainNet = useNetwork().id as QSMainNet;
  const [balances, setBalances] = useState<number[]>();

  useEffect(() => {
    const loadBalance = async () => {
      if (!tezos) return;
      if (!accountPkh) return;
      if (!farms) return;

      const dexs = farms.map((farm) => {
        const asset:Token = {
          contract: farm.stakedToken.contractAddress,
          id: farm.stakedToken.fa2TokenId,
        };

        return getContract(tezos, <string>asset.contract);
      });

      const dexbufs = await Promise.all<ContractAbstraction<ContractProvider>>(dexs);
      const shares = dexbufs.map((dexbuf) => getLiquidityShare(tezos, dexbuf, accountPkh));
      const sharesResolved = await Promise.all(shares);

      const price = new BigNumber(exchangeRates
        ? exchangeRates[exchangeRates.length - 1]?.exchangeRate
        : NaN);

      const balancesArray = sharesResolved.map((share) => {
        const shareTotal = +share.total.toString() / 1_000_000;
        return shareTotal * +price;
      });

      setBalances(balancesArray);
    };

    if (accountPkh) {
      loadBalance();
    } else {
      setBalances(undefined);
    }

    return () => setBalances([]);
  }, [accountPkh, farms, tezos, exchangeRates, networkId]);

  return balances;
};
