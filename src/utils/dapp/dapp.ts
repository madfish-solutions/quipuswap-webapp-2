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

import {
  APP_NAME,
  BASE_URL,
  FARM_CONTRACT_MAINNET,
  FARM_CONTRACT_TESTNET,
  LAST_USED_ACCOUNT_KEY,
  LAST_USED_CONNECTION_KEY,
  MAINNET_NETWORK,
  METADATA_API_MAINNET,
  METADATA_API_TESTNET,
} from '@utils/defaults';
import {
  FarmingStorageInfo,
  FarmsFromServerWithWhitelistedPair,
  QSMainNet,
  QSNetwork,
  WhitelistedBaker,
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
import { ReadOnlySigner } from './ReadOnlySigner';
import {
  getNetwork,
  setNetwork,
  toBeaconNetworkType,
} from './network';
import { getFarms } from './farms';
import { getStakes } from './stakes';

const michelEncoder = new MichelCodecPacker();
const beaconWallet = typeof window === 'undefined' ? undefined : new BeaconWallet({
  name: APP_NAME,
  iconUrl: `${BASE_URL}/favicon.ico`,
});

export const TEMPLE_WALLET_NOT_INSTALLED_MESSAGE = 'Temple wallet not installed';

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
  farms: { data:FarmsFromServerWithWhitelistedPair[], loading:boolean, error?:string },
  stakes: { data:FarmsFromServerWithWhitelistedPair[], loading:boolean, error?:string },
  searchBakers: { data:WhitelistedBaker[], loading:boolean, error?:string },
  farmingStorage: FarmingStorageInfo | undefined,
  farmingContract: ContractAbstraction<ContractProvider> | undefined,
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
    farms,
    stakes,
    searchBakers,
    farmingStorage,
    farmingContract,
  }, setState] = useState<DAppType>({
    connectionType: null,
    tezos: null,
    accountPkh: null,
    templeWallet: null,
    network: net,
    tokens: { loading: true, data: [] },
    searchTokens: { loading: false, data: [] },
    bakers: { loading: true, data: [] },
    farms: { loading: true, data: [] },
    stakes: { loading: true, data: [] },
    searchBakers: { loading: false, data: [] },
    farmingStorage: undefined,
    farmingContract: undefined,
  });

  const loadFarmingStorage = useCallback(async () => {
    const contract:FarmingStorageInfo = await getStorageInfo(
      tezos ?? fallbackToolkit,
      network.id === 'granadanet' ? FARM_CONTRACT_TESTNET : FARM_CONTRACT_MAINNET,
    );

    return contract;
  }, [tezos, network]);

  useEffect(() => {
    const loadStorage = async () => {
      const contractStorage = await loadFarmingStorage();

      setState((prevState) => ({
        ...prevState,
        farmingStorage: contractStorage,
      }));
    };

    if (network && tezos) {
      loadStorage();
    }
  }, [network, tezos, loadFarmingStorage]);

  useEffect(() => {
    const loadFarmingContract = async () => {
      const contract = await getContract(
        tezos ?? fallbackToolkit,
        network.id === 'granadanet' ? FARM_CONTRACT_TESTNET : FARM_CONTRACT_MAINNET,
      );

      setState((prevState) => ({
        ...prevState,
        farmingContract: contract,
      }));
    };

    loadFarmingContract();
  }, [network, tezos]);

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

  const getBakersData = useCallback(() => getBakers(network.id as QSMainNet), [network]);
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
  }, [bakersData, network]);

  const getFarmsData = useCallback(() => getFarms(), []);
  const {
    data: farmsData,
  } = useSWR(
    ['farms-initial-data'],
    getFarmsData,
  );

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      farms: { loading: false, data: farmsData ?? [] },
    }));
  }, [farmsData]);

  const getStakesData = useCallback(() => getStakes(), []);
  const {
    data: stakesData,
  } = useSWR(
    ['stakes-initial-data'],
    getStakesData,
  );

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      stakes: { loading: false, data: stakesData ?? [] },
    }));
  }, [stakesData]);

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
    farms,
    stakes,
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
  useFarms,
  useStakes,
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
  (v) => v.farms,
  (v) => v.stakes,
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
);
