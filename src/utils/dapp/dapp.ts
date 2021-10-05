import {
  useCallback, useEffect, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import constate from 'constate';
import { TempleWallet } from '@temple-wallet/dapp';
import {
  ContractAbstraction,
  ContractProvider,
  MichelCodecPacker,
  TezosToolkit,
} from '@taquito/taquito';
import { NetworkType } from '@airgap/beacon-sdk';
import useSWR from 'swr';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { findDex, FoundDex, Token } from '@quipuswap/sdk';

import {
  APP_NAME,
  BASE_URL,
  FACTORIES,
  FARM_CONTRACT,
  LAST_USED_ACCOUNT_KEY,
  LAST_USED_CONNECTION_KEY,
  MAINNET_NETWORK,
  METADATA_API_MAINNET,
  METADATA_API_TESTNET,
  OPERATIONS,
  STABLE_TOKEN,
  TEZOS_TOKEN,
  TZKT_LINK_TESTNET,
} from '@utils/defaults';
import {
  FarmingStorageInfo,
  FarmingInfoType,
  QSMainNet,
  QSNetwork,
  WhitelistedBaker,
  WhitelistedFarmOptional,
  WhitelistedToken,
} from '@utils/types';
import { getBakers } from '@utils/dapp/bakers';

import {
  getContractInfo, getTokens, saveCustomToken,
} from '@utils/dapp/tokens';
import { getTokenMetadata } from '@utils/dapp/tokensMetadata';
import { getBakerMetadata } from '@utils/dapp/bakersMetadata';
import { isContractAddress } from '@utils/validators';
import { getContract, getStorageInfo } from '@utils/dapp/getStorageInfo';
import { prettyPrice } from '@utils/helpers';
import { ReadOnlySigner } from './ReadOnlySigner';
import {
  getNetwork,
  setNetwork,
  toBeaconNetworkType,
} from './network';

const michelEncoder = new MichelCodecPacker();
const beaconWallet = typeof window === 'undefined' ? undefined : new BeaconWallet({
  name: APP_NAME,
  iconUrl: `${BASE_URL}/favicon.ico`,
});

export const TEMPLE_WALLET_NOT_INSTALLED_MESSAGE = 'Temple wallet not installed';

const fallbackPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
};

const net = getNetwork();

const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
  const available = await TempleWallet.isAvailable();
  if (!available) {
    throw new Error(TEMPLE_WALLET_NOT_INSTALLED_MESSAGE);
  }

  let perm;
  if (!forcePermission) {
    perm = await TempleWallet.getCurrentPermission();
  }

  const wallet = new TempleWallet(APP_NAME, perm);

  if (!wallet.connected) {
    await wallet.connect(
      network.connectType === 'default'
        ? (network.id as any)
        : {
          name: network.name,
          rpc: network.rpcBaseURL,
        },
      { forcePermission: true },
    );
  }

  const tezos = wallet.toTezos();
  tezos.setPackerProvider(michelEncoder);
  const { pkh, publicKey } = wallet.permission!;
  tezos.setSignerProvider(new ReadOnlySigner(pkh, publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'temple');
  return { pkh, toolkit: tezos, wallet };
};

const connectWalletBeacon = async (forcePermission: boolean, network: QSNetwork) => {
  if (!beaconWallet) {
    throw new Error('Cannot use beacon out of window');
  }

  const activeAccount = await beaconWallet.client.getActiveAccount();
  if (forcePermission || !activeAccount) {
    if (activeAccount) {
      await beaconWallet.clearActiveAccount();
    }
    await beaconWallet.requestPermissions({
      network: network.connectType === 'custom' && network.type === 'test'
        ? {
          type: NetworkType.CUSTOM,
          name: network.name,
          rpcUrl: network.rpcBaseURL,
        }
        : { type: toBeaconNetworkType(network.id) },
    });
  }

  const tezos = new TezosToolkit(network.rpcBaseURL);
  tezos.setPackerProvider(michelEncoder);
  tezos.setWalletProvider(beaconWallet);
  const activeAcc = await beaconWallet.client.getActiveAccount();
  if (!activeAcc) {
    throw new Error('Not connected');
  }

  tezos.setSignerProvider(
    new ReadOnlySigner(activeAcc.address, activeAcc.publicKey),
  );
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'beacon');
  localStorage.setItem(LAST_USED_ACCOUNT_KEY, activeAcc.accountIdentifier);
  return { pkh: activeAcc.address, toolkit: tezos };
};

export type DAppType = {
  connectionType: 'beacon' | 'temple' | null
  tezos: TezosToolkit | null
  accountPkh: string | null
  templeWallet: TempleWallet | null
  network: QSNetwork
  tokens: { data:WhitelistedToken[], loading:boolean, error?:string },
  searchTokens: { data:WhitelistedToken[], loading:boolean, error?:string },
  bakers: { data:WhitelistedBaker[], loading:boolean, error?:string },
  searchBakers: { data:WhitelistedBaker[], loading:boolean, error?:string },
  farmingStorage: FarmingStorageInfo | undefined,
  farmingContract: ContractAbstraction<ContractProvider> | undefined,
  allFarms: WhitelistedFarmOptional[] | undefined,
};

const fallbackToolkit = new TezosToolkit(net.rpcBaseURL);
fallbackToolkit.setPackerProvider(michelEncoder);

function useDApp() {
  const [{
    connectionType,
    tezos,
    accountPkh,
    templeWallet,
    network,
    tokens,
    searchTokens,
    bakers,
    searchBakers,
    farmingStorage,
    farmingContract,
    allFarms,
  }, setState] = useState<DAppType>({
    connectionType: null,
    tezos: null,
    accountPkh: null,
    templeWallet: null,
    network: net,
    tokens: { loading: true, data: [] },
    searchTokens: { loading: false, data: [] },
    bakers: { loading: true, data: [] },
    searchBakers: { loading: false, data: [] },
    farmingStorage: undefined,
    farmingContract: undefined,
    allFarms: undefined,
  });
  const loadFaringStorage = useCallback(async () => {
    const contract:FarmingStorageInfo = await getStorageInfo(
      tezos ?? fallbackToolkit,
      FARM_CONTRACT,
    );

    return contract;
  }, [network, tezos]);

  useEffect(() => {
    const loadStorage = async () => {
      const contractStorage = await loadFaringStorage();

      setState((prevState) => ({
        ...prevState,
        farmingStorage: contractStorage,
      }));
    };

    if (network && tezos) {
      loadStorage();
    }
  }, [network, tezos]);

  useEffect(() => {
    const loadFarmingContract = async () => {
      const contract = await getContract(tezos ?? fallbackToolkit, FARM_CONTRACT);

      setState((prevState) => ({
        ...prevState,
        farmingContract: contract,
      }));
    };

    loadFarmingContract();
  }, [network, tezos]);

  const loadFarms = useCallback(async () => {
    const farmingStorageLoaded = await loadFaringStorage();
    if (!farmingStorageLoaded) return [];

    const possibleFarms:Promise<FarmingInfoType | undefined>[] = new Array(
      +farmingStorageLoaded?.storage.farms_count.toString(),
    )
      .fill(0)
      .map(async (x, id) => (farmingStorageLoaded?.storage.farms.get(id)));

    const tempFarms = await Promise.all(possibleFarms);

    const farmContractUrl = FARM_CONTRACT
      ? `${TZKT_LINK_TESTNET}/${FARM_CONTRACT}/${OPERATIONS}`
      : '#';

    if (tempFarms) {
      const clearfarms = (tempFarms
        .filter((farm) => !!farm) as FarmingInfoType[]
      );

      console.log({clearfarms});

      const tokenContracts = clearfarms.map((farm) => {
        let asset:Token = { contract: '' };

        if (farm.stake_params.staked_token.fA2) {
          asset = {
            contract: farm.stake_params.staked_token.fA2.token,
            id: farm.stake_params.staked_token.fA2.id,
          };
        }

        if (farm.stake_params.staked_token.fA12) {
          asset = { contract: farm.stake_params.staked_token.fA12 };
        }

        if (!farm.stake_params.is_lp_staked_token) {
          return findDex(tezos ?? fallbackToolkit, FACTORIES[network.id as QSMainNet], asset);
        }

        return asset.contract.toString();
      });

      const tokenContractsResolved = await Promise
        .all<(string | Promise<FoundDex>)>(tokenContracts);

      if (tokenContractsResolved) {
        const whitelistedFarms:WhitelistedFarmOptional[] = clearfarms.map((farm, id) => ({
          id,
          totalValueLocked: prettyPrice(Number(farm?.staked)),
          tokenPair: fallbackPair,
          apy: '888%',
          daily: '0.008%',
          multiplier: '888',
          tokenContract: `${TZKT_LINK_TESTNET}/${tokenContractsResolved[id]}/${OPERATIONS}`,
          farmContract: farmContractUrl,
          projectLink: '#',
          analyticsLink: '#',
          remaining: new Date(Date.now() + 48 * 3600000),
          claimed: farm.claimed.toString(),
          isLpTokenStaked: farm.stake_params.is_lp_staked_token,
          stakedToken: farm.stake_params.staked_token,
          startTime: farm.start_time,
          rewardPerSecond: farm.reward_per_second,
        }));

        return whitelistedFarms;
      }
    }

    return [];
  }, [tezos, network, farmingStorage, accountPkh]);
  const {
    data: farms,
  } = useSWR(
    ['all-farms-loaded', network],
    loadFarms,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      allFarms: farms,
    }));
  }, [farms]);

  const setFallbackState = useCallback(
    () => setState((prevState) => ({
      ...prevState,
      connectionType: null,
      tezos: prevState.tezos ?? fallbackToolkit,
    })),
    [],
  );

  const getTempleInitialAvailable = useCallback(() => TempleWallet.isAvailable(), []);
  const {
    data: templeInitialAvailable,
  } = useSWR(
    ['temple-initial-available'],
    getTempleInitialAvailable,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const ready = Boolean(tezos) || (templeInitialAvailable === false);

  useEffect(() => {
    TempleWallet.onAvailabilityChange(async (available) => {
      const lastUsedConnection = localStorage.getItem(LAST_USED_CONNECTION_KEY);
      if (available) {
        try {
          let perm;
          try {
            perm = await TempleWallet.getCurrentPermission();
          } catch (error) {
            // eslint-disable-next-line
            console.log(error);
          }

          const wlt = new TempleWallet(
            APP_NAME,
            lastUsedConnection === 'temple' ? perm : null,
          );

          if (lastUsedConnection === 'temple') {
            const pkh = wlt.connected ? await wlt.getPKH() : null;
            const tk = wlt.connected ? wlt.toTezos() : fallbackToolkit;
            if (wlt.connected && pkh) {
              const { publicKey } = wlt.permission!;
              tk.setSignerProvider(new ReadOnlySigner(pkh, publicKey));
            }
            setState((prevState) => ({
              ...prevState,
              templeWallet: wlt,
              tezos: tk,
              accountPkh: pkh,
              connectionType: wlt.connected ? 'temple' : null,
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              tezos: prevState.tezos ?? fallbackToolkit,
              templeWallet: wlt,
            }));
          }

          return;
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      }

      if (lastUsedConnection !== 'beacon') {
        setFallbackState();
      }
    });
    const lastUsedAccount = localStorage.getItem(LAST_USED_ACCOUNT_KEY);
    if (localStorage.getItem(LAST_USED_CONNECTION_KEY) === 'beacon' && lastUsedAccount) {
      if (!beaconWallet) {
        return;
      }
      beaconWallet.client.getAccount(lastUsedAccount).then((value) => {
        if (!value) {
          localStorage.removeItem(LAST_USED_ACCOUNT_KEY);
          localStorage.removeItem(LAST_USED_CONNECTION_KEY);
          setFallbackState();
          return;
        }

        const toolkit = new TezosToolkit(net.rpcBaseURL);
        toolkit.setPackerProvider(michelEncoder);
        toolkit.setWalletProvider(beaconWallet);

        setState((prevState) => ({
          ...prevState,
          templeWallet: null,
          accountPkh: value.address,
          connectionType: 'beacon',
          tezos: toolkit,
          network: net,
        }));
      }).catch((e) => {
        // eslint-disable-next-line
        console.error(e);
        setFallbackState();
      });
    }
  }, [setFallbackState]);

  useEffect(() => {
    if (templeInitialAvailable === false && localStorage.getItem(LAST_USED_CONNECTION_KEY) === 'temple') {
      setFallbackState();
    }
  }, [setFallbackState, templeInitialAvailable]);

  const getTokensData = useCallback(() => getTokens(network, true), [network]);
  const {
    data: tokensData,
  } = useSWR(
    ['tokens-initial-data', network],
    getTokensData,
  );

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      tokens: { loading: !tokensData, data: tokensData ?? [] },
    }));
  }, [tokensData]);

  const getBakersData = useCallback(() => getBakers(), []);
  const {
    data: bakersData,
  } = useSWR(
    ['bakers-initial-data'],
    getBakersData,
  );

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      bakers: { loading: false, data: bakersData ?? [] },
    }));
  }, [bakersData]);

  useEffect(() => {
    if (!tezos || tezos.rpc.getRpcUrl() !== network.rpcBaseURL) {
      const wlt = new TempleWallet(
        APP_NAME,
        null,
      );
      const fallbackTzTk = new TezosToolkit(network.rpcBaseURL);
      fallbackTzTk.setPackerProvider(michelEncoder);
      const pkh = null;
      setState((prevState) => ({
        ...prevState,
        network,
        templeWallet: wlt,
        tezos: fallbackTzTk,
        accountPkh: pkh,
        connectionType: null,
      }));
    }
    // eslint-disable-next-line
  }, [network]);

  const searchCustomToken = useCallback(
    async (
      address: string,
      tokenId?: number,
      saveAfterSearch?:boolean,
    ): Promise<WhitelistedToken | null> => {
      if (await isContractAddress(address) === true) {
        setState((prevState) => ({
          ...prevState,
          searchTokens: { loading: true, data: [] },
        }));
        let type;
        try {
          type = await getContractInfo(address, tezos!!);
        } catch (e) {
          type = null;
        }
        if (!type) {
          setState((prevState) => ({
            ...prevState,
            searchTokens: { loading: false, data: [] },
          }));
          return null;
        }
        const isFa2 = !!type.methods.update_operators;
        const customToken = await getTokenMetadata(network.id === MAINNET_NETWORK.id
          ? METADATA_API_MAINNET
          : METADATA_API_TESTNET, address, tokenId);
        if (!customToken) {
          setState((prevState) => ({
            ...prevState,
            searchTokens: { loading: false, data: [] },
          }));
          return null;
        }
        const token : WhitelistedToken = {
          contractAddress: address,
          metadata: customToken,
          type: !isFa2 ? 'fa1.2' : 'fa2',
          fa2TokenId: !isFa2 ? undefined : tokenId || 0,
          network: network.id,
        } as WhitelistedToken;
        setState((prevState) => ({
          ...prevState,
          searchTokens: { loading: false, data: [token] },
        }));
        if (saveAfterSearch) saveCustomToken(token);
        return token;
      }
      return null;
    },
    [tezos, network],
  );

  const addCustomToken = useCallback((token:WhitelistedToken) => {
    saveCustomToken(token);
    setState((prevState) => ({
      ...prevState,
      tokens: { ...tokens, data: [...tokens.data, token] },
      searchTokens: { loading: false, data: [] },
    }));
  }, [tokens]);

  const searchCustomBaker = useCallback(
    async (address: string) => {
      if (await isContractAddress(address)) {
        setState((prevState) => ({
          ...prevState,
          searchBakers: { loading: true, data: [] },
        }));
        const customBaker = await getBakerMetadata(address);
        if (customBaker) {
          const baker = {
            address: customBaker.address,
            name: customBaker.name,
            logo: customBaker.logo,
            fee: customBaker.fee,
            freeSpace: new BigNumber(customBaker.freeSpace),
            votes: 0,
          } as WhitelistedBaker;
          setState((prevState) => ({
            ...prevState,
            searchBakers: { loading: false, data: [baker] },
          }));
        }
      }
    },
    [],
  );

  const addCustomBaker = useCallback((baker:WhitelistedBaker) => {
    setState((prevState) => ({
      ...prevState,
      bakers: { ...bakers, data: [...bakers.data, baker] },
      searchBakers: { loading: false, data: [] },
    }));
  }, [bakers]);

  useEffect(() => {
    if (templeWallet && templeWallet.connected) {
      TempleWallet.onPermissionChange((perm) => {
        if (!perm) {
          setState((prevState) => ({
            ...prevState,
            templeWallet: new TempleWallet(APP_NAME),
            tezos: new TezosToolkit(net.rpcBaseURL),
            accountPkh: null,
            connectionType: null,
            network: net,
          }));
        }
      });
    }
  }, [templeWallet]);

  const connectWithTemple = useCallback(
    async (forcePermission: boolean) => {
      const { pkh, toolkit, wallet } = await connectWalletTemple(forcePermission, network);
      setState((prevState) => ({
        ...prevState,
        connectionType: 'temple',
        tezos: toolkit,
        accountPkh: pkh,
        templeWallet: wallet,
        network,
      }));
    },
    [network],
  );

  const connectWithBeacon = useCallback(
    async (forcePermission: boolean) => {
      const { pkh, toolkit } = await connectWalletBeacon(forcePermission, network);

      setState((prevState) => ({
        ...prevState,
        connectionType: 'beacon',
        tezos: toolkit,
        accountPkh: pkh,
        templeWallet: null,
        network,
      }));
    },
    [network],
  );

  const disconnect = useCallback(
    async () => {
      setState((prevState) => ({
        ...prevState,
        tezos: fallbackToolkit,
        accountPkh: null,
        connectionType: null,
      }));
      localStorage.removeItem(LAST_USED_CONNECTION_KEY);
    },
    [],
  );

  const changeNetwork = useCallback(
    (networkNew: QSNetwork) => {
      setState((prevState) => ({
        ...prevState,
        network: networkNew,
      }));
      setNetwork(networkNew);
    },
    [],
  );

  return {
    connectionType,
    tezos,
    accountPkh,
    templeWallet,
    ready,
    network,
    tokens,
    searchTokens,
    bakers,
    searchBakers,
    connectWithBeacon,
    connectWithTemple,
    disconnect,
    changeNetwork,
    addCustomToken,
    searchCustomToken,
    addCustomBaker,
    searchCustomBaker,
    farmingStorage,
    farmingContract,
    allFarms,
  };
}

export const [
  DAppProvider,
  useConnectionType,
  useTezos,
  useAccountPkh,
  useTempleWallet,
  useReady,
  useNetwork,
  useTokens,
  useSearchTokens,
  useBakers,
  useSearchBakers,
  useConnectWithBeacon,
  useConnectWithTemple,
  useDisconnect,
  useChangeNetwork,
  useAddCustomToken,
  useSearchCustomTokens,
  useAddCustomBaker,
  useSearchCustomBaker,
  useFarmingStorage,
  useFarmingContract,
  useAllFarms,
] = constate(
  useDApp,
  (v) => v.connectionType,
  (v) => v.tezos,
  (v) => v.accountPkh,
  (v) => v.templeWallet,
  (v) => v.ready,
  (v) => v.network,
  (v) => v.tokens,
  (v) => v.searchTokens,
  (v) => v.bakers,
  (v) => v.searchBakers,
  (v) => v.connectWithBeacon,
  (v) => v.connectWithTemple,
  (v) => v.disconnect,
  (v) => v.changeNetwork,
  (v) => v.addCustomToken,
  (v) => v.searchCustomToken,
  (v) => v.addCustomBaker,
  (v) => v.searchCustomBaker,
  (v) => v.farmingStorage,
  (v) => v.farmingContract,
  (v) => v.allFarms,
);
