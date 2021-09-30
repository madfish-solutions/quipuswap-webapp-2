import { useEffect, useState } from 'react';
import {
  getContract, useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { FACTORIES } from '@utils/defaults';
import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { QSMainNet } from '@utils/types';
import BigNumber from 'bignumber.js';
import {
  findDex, FoundDex, getLiquidityShare, Token,
} from '@quipuswap/sdk';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { useFarms } from '@hooks/useFarms';

export const useBalance = () => {
  const tezos = useTezos();
  const allFarms = useFarms();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const networkId:QSMainNet = useNetwork().id as QSMainNet;
  const [balances, setBalances] = useState<number[]>();

  useEffect(() => {
    const loadBalance = async () => {
      if (!tezos) return;
      if (!accountPkh) return;
      const dexs = allFarms.map((farm) => {
        let asset:Token = { contract: '' };

        if (farm.stakedToken.fA2) {
          asset = {
            contract: farm.stakedToken.fA2.token,
            id: farm.stakedToken.fA2.id,
          };
        }

        if (farm.stakedToken.fA12) {
          asset = { contract: farm.stakedToken.fA12 };
        }

        if (farm.isLpTokenStaked) {
          return getContract(tezos, <string>asset.contract);
        }

        return findDex(tezos, FACTORIES[networkId], asset);
      });
      const dexbufs = await Promise.all<ContractAbstraction<ContractProvider> | FoundDex>(dexs);
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
      setBalances([]);
    }

    return () => setBalances([]);
  }, [accountPkh, allFarms, tezos, exchangeRates, networkId]);

  return balances;
};
