import { useCallback, useEffect, useMemo, useState } from 'react';

import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import BigNumber from 'bignumber.js';
import constate from 'constate';
import useSWR from 'swr';

import {
  APP_NAME,
  BASE_URL,
  HANGZHOUNET_NETWORK,
  LAST_USED_ACCOUNT_KEY,
  LAST_USED_CONNECTION_KEY,
  MAINNET_NETWORK
} from '@app.config';
import { Standard } from '@graphql';
import { getBakers } from '@utils/dapp/bakers';
import { getBakerMetadata } from '@utils/dapp/bakersMetadata';
import { getFallbackTokens, getTokens, saveCustomToken } from '@utils/dapp/tokens';
import { getTokenMetadata } from '@utils/dapp/tokensMetadata';
import { isTokenEqual } from '@utils/helpers';
import {
  QSMainNet,
  QSNetwork,
  QSNetworkType,
  WhitelistedBaker,
  WhitelistedToken,
  WhitelistedTokenWithQSNetworkType
} from '@utils/types';
import { isValidContractAddress } from '@utils/validators';
import { NoTempleWalletError } from 'errors';

import { getContract } from './getStorageInfo';
import { getNetwork, setNetwork, toBeaconNetworkType } from './network';
import { ReadOnlySigner } from './ReadOnlySigner';
import { FastRpcClient } from './taquito-fast-rpc';

const michelEncoder = new MichelCodecPacker();
const beaconWallet =
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: APP_NAME,
        iconUrl: `${BASE_URL}/favicon.ico`,
        preferredNetwork: (() => {
          const net = getNetwork();
          if (!(net.connectType === 'custom' && net.type === QSNetworkType.TEST)) {
            return toBeaconNetworkType(net.id);
          }

          return toBeaconNetworkType('mainnet');
        })()
      });

const net = getNetwork();

const rpcClients: Record<QSMainNet, FastRpcClient> = {
  hangzhounet: new FastRpcClient(HANGZHOUNET_NETWORK.rpcBaseURL),
  mainnet: new FastRpcClient(MAINNET_NETWORK.rpcBaseURL)
};

const getTempleWalletState = async (wallet: TempleWallet, networkId: QSMainNet) => {
  const tezos = new TezosToolkit(rpcClients[networkId]);
  tezos.setWalletProvider(wallet);
  tezos.setPackerProvider(michelEncoder);
  tezos.setRpcProvider(rpcClients[networkId]);
  const pkh = wallet.connected ? await wallet.getPKH() : null;
  let pk: string | null = null;
  if (wallet.connected && pkh) {
    const { pkh, publicKey } = wallet.permission!;
    pk = publicKey;
    tezos.setSignerProvider(new ReadOnlySigner(pkh, publicKey));
  }

  return { pkh, tezos, pk };
};

const connectWalletTemple = async (forcePermission: boolean, network: QSNetwork) => {
  const available = await TempleWallet.isAvailable();
  if (!available) {
    throw new NoTempleWalletError();
  }

  let perm;
  if (!forcePermission) {
    perm = await TempleWallet.getCurrentPermission();
  }

  const wallet = new TempleWallet(APP_NAME, perm);

  if (!wallet.connected) {
    await wallet.connect(
      network.connectType === 'default'
        ? (network.id as never)
        : {
            name: network.name,
            rpc: network.rpcBaseURL
          },
      { forcePermission: true }
    );
  }

  const { pkh, pk, tezos } = await getTempleWalletState(wallet, network.id);
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'temple');

  return { pkh, pk, toolkit: tezos, wallet };
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
      network:
        network.connectType === 'custom' && network.type === QSNetworkType.TEST
          ? {
              type: NetworkType.CUSTOM,
              name: network.name,
              rpcUrl: network.rpcBaseURL
            }
          : { type: toBeaconNetworkType(network.id) }
    });
  }

  const tezos = new TezosToolkit(rpcClients[network.id]);
  tezos.setPackerProvider(michelEncoder);
  tezos.setWalletProvider(beaconWallet);
  const activeAcc = await beaconWallet.client.getActiveAccount();
  if (!activeAcc) {
    throw new Error('Not connected');
  }

  tezos.setSignerProvider(new ReadOnlySigner(activeAcc.address, activeAcc.publicKey));
  localStorage.setItem(LAST_USED_CONNECTION_KEY, 'beacon');
  localStorage.setItem(LAST_USED_ACCOUNT_KEY, activeAcc.accountIdentifier);

  return { pkh: activeAcc.address, pk: activeAcc.publicKey, toolkit: tezos };
};

export interface DAppType {
  connectionType: 'beacon' | 'temple' | null;
  tezos: TezosToolkit | null;
  accountPkh: string | null;
  accountPublicKey: string | null;
  templeWallet: TempleWallet | null;
  network: QSNetwork;
  tokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
  searchTokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
  bakers: { data: WhitelistedBaker[]; loading: boolean; error?: string };
  searchBakers: { data: WhitelistedBaker[]; loading: boolean; error?: string };
}

export const fallbackToolkits: Record<QSMainNet, TezosToolkit> = {
  hangzhounet: new TezosToolkit(rpcClients.hangzhounet),
  mainnet: new TezosToolkit(rpcClients.mainnet)
};

Object.values(fallbackToolkits).forEach(toolkit => toolkit.setPackerProvider(michelEncoder));

function useDApp() {
  const [
    {
      accountPublicKey,
      connectionType,
      tezos,
      accountPkh,
      templeWallet,
      network,
      tokens,
      searchTokens,
      bakers,
      searchBakers
    },
    setState
  ] = useState<DAppType>({
    connectionType: null,
    tezos: null,
    accountPkh: null,
    accountPublicKey: null,
    templeWallet: null,
    network: net,
    tokens: { loading: true, data: [] },
    searchTokens: { loading: false, data: [] },
    bakers: { loading: true, data: [] },
    searchBakers: { loading: false, data: [] }
  });

  const setFallbackState = useCallback(
    () =>
      setState(prevState => ({
        ...prevState,
        connectionType: null,
        tezos: prevState.tezos ?? fallbackToolkits[network.id]
      })),
    [network.id]
  );

  const getTempleInitialAvailable = useCallback(async () => TempleWallet.isAvailable(), []);
  const { data: templeInitialAvailable } = useSWR(['temple-initial-available'], getTempleInitialAvailable, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const ready = Boolean(tezos) || templeInitialAvailable === false;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    TempleWallet.onAvailabilityChange(async available => {
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

          const wlt = new TempleWallet(APP_NAME, lastUsedConnection === 'temple' ? perm : null);

          if (lastUsedConnection === 'temple') {
            const { pkh, pk, tezos } = await getTempleWalletState(wlt, net.id);
            setState(prevState => ({
              ...prevState,
              templeWallet: wlt,
              tezos,
              accountPkh: pkh,
              accountPublicKey: pk,
              connectionType: wlt.connected ? 'temple' : null
            }));
          } else {
            setState(prevState => ({
              ...prevState,
              tezos: prevState.tezos ?? fallbackToolkits[net.id],
              templeWallet: wlt
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
      beaconWallet.client
        .getAccount(lastUsedAccount)
        .then(value => {
          if (!value) {
            localStorage.removeItem(LAST_USED_ACCOUNT_KEY);
            localStorage.removeItem(LAST_USED_CONNECTION_KEY);
            setFallbackState();

            return;
          }

          const toolkit = new TezosToolkit(rpcClients[net.id]);
          toolkit.setPackerProvider(michelEncoder);
          toolkit.setWalletProvider(beaconWallet);

          setState(prevState => ({
            ...prevState,
            templeWallet: null,
            accountPkh: value.address,
            accountPublicKey: value.publicKey,
            connectionType: 'beacon',
            tezos: toolkit,
            network: net
          }));
        })
        .catch(e => {
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

  const getTokensData = useCallback(async () => getTokens(network, true), [network]);
  const { data: tokensData, error: tokensError } = useSWR(['tokens-initial-data', network], getTokensData);

  useEffect(() => {
    setState(prevState => {
      const prevTokens = prevState.tokens.data;
      const fallbackTokens = prevTokens.length === 0 ? getFallbackTokens(network, true) : prevTokens;

      return {
        ...prevState,
        tokens: { loading: !tokensData && !tokensError, data: tokensData ?? fallbackTokens }
      };
    });
  }, [tokensData, tokensError, network]);

  const getBakersData = useCallback(async () => getBakers(), []);
  const { data: bakersData } = useSWR(['bakers-initial-data'], getBakersData);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      bakers: { loading: false, data: bakersData ?? [] }
    }));
  }, [bakersData]);

  useEffect(() => {
    if (!tezos || tezos.rpc.getRpcUrl() !== network.rpcBaseURL) {
      const wlt = new TempleWallet(APP_NAME, null);
      const fallbackTzTk = fallbackToolkits[network.id];
      setState(prevState => ({
        ...prevState,
        network,
        templeWallet: wlt,
        tezos: fallbackTzTk,
        accountPkh: null,
        accountPublicKey: null,
        connectionType: null
      }));
    }
    // eslint-disable-next-line
  }, [network]);

  const searchCustomToken = useCallback(
    async (address: string, tokenId?: number, saveAfterSearch?: boolean): Promise<WhitelistedToken | null> => {
      if (isValidContractAddress(address)) {
        setState(prevState => ({
          ...prevState,
          searchTokens: { loading: true, data: [] }
        }));
        let type;
        try {
          type = await getContract(tezos!, address);
        } catch (e) {
          type = null;
        }
        if (!type) {
          setState(prevState => ({
            ...prevState,
            searchTokens: { loading: false, data: [] }
          }));

          return null;
        }
        const isFa2 = !!type.methods.update_operators;
        const customToken = await getTokenMetadata(network, address, tokenId);
        if (!customToken) {
          setState(prevState => ({
            ...prevState,
            searchTokens: { loading: false, data: [] }
          }));

          return null;
        }
        const token: WhitelistedTokenWithQSNetworkType = {
          contractAddress: address,
          metadata: customToken,
          type: !isFa2 ? Standard.Fa12 : Standard.Fa2,
          fa2TokenId: !isFa2 ? undefined : tokenId || 0,
          network: network.id
        };
        setState(prevState => ({
          ...prevState,
          searchTokens: { loading: false, data: [token] }
        }));
        if (saveAfterSearch) {
          saveCustomToken(token);
        }

        return token;
      }

      return null;
    },
    [tezos, network]
  );

  const addCustomToken = useCallback(
    (token: WhitelistedTokenWithQSNetworkType) => {
      saveCustomToken(token);
      setState(prevState => ({
        ...prevState,
        tokens: {
          ...tokens,
          data: [...tokens.data.filter(alreadyPresentToken => !isTokenEqual(alreadyPresentToken, token)), token]
        },
        searchTokens: { loading: false, data: [] }
      }));
    },
    [tokens]
  );

  const searchCustomBaker = useCallback(async (address: string) => {
    if (isValidContractAddress(address)) {
      setState(prevState => ({
        ...prevState,
        searchBakers: { loading: true, data: [] }
      }));
      const customBaker = await getBakerMetadata(address);
      if (customBaker) {
        const baker = {
          address: customBaker.address,
          name: customBaker.name,
          logo: customBaker.logo,
          fee: customBaker.fee,
          freeSpace: new BigNumber(customBaker.freeSpace),
          votes: 0
        } as WhitelistedBaker;
        setState(prevState => ({
          ...prevState,
          searchBakers: { loading: false, data: [baker] }
        }));
      }
    }
  }, []);

  const addCustomBaker = useCallback(
    (baker: WhitelistedBaker) => {
      setState(prevState => ({
        ...prevState,
        bakers: { ...bakers, data: [...bakers.data, baker] },
        searchBakers: { loading: false, data: [] }
      }));
    },
    [bakers]
  );

  useEffect(() => {
    if (templeWallet && templeWallet.connected) {
      TempleWallet.onPermissionChange(perm => {
        if (!perm) {
          setState(prevState => ({
            ...prevState,
            templeWallet: new TempleWallet(APP_NAME),
            tezos: fallbackToolkits[net.id],
            accountPkh: null,
            accountPublicKey: null,
            connectionType: null,
            network: net
          }));
        }
      });
    }
  }, [templeWallet]);

  const connectWithTemple = useCallback(
    async (forcePermission: boolean) => {
      const { pkh, pk, toolkit, wallet } = await connectWalletTemple(forcePermission, network);
      setState(prevState => ({
        ...prevState,
        connectionType: 'temple',
        tezos: toolkit,
        accountPkh: pkh,
        accountPublicKey: pk,
        templeWallet: wallet,
        network
      }));
    },
    [network]
  );

  const connectWithBeacon = useCallback(
    async (forcePermission: boolean) => {
      const { pkh, pk, toolkit } = await connectWalletBeacon(forcePermission, network);

      setState(prevState => ({
        ...prevState,
        connectionType: 'beacon',
        tezos: toolkit,
        accountPkh: pkh,
        accountPublicKey: pk,
        templeWallet: null,
        network
      }));
    },
    [network]
  );

  const disconnect = useCallback(async () => {
    setState(prevState => ({
      ...prevState,
      tezos: fallbackToolkits[network.id],
      accountPkh: null,
      accountPublicKey: null,
      connectionType: null
    }));
    localStorage.removeItem(LAST_USED_CONNECTION_KEY);
  }, [network.id]);

  const changeNetwork = useCallback((networkNew: QSNetwork) => {
    setState(prevState => ({
      ...prevState,
      accountPkh: null,
      accountPublicKey: null,
      connectionType: null,
      tezos: fallbackToolkits[networkNew.id],
      network: networkNew
    }));
    setNetwork(networkNew);
  }, []);

  const estimationToolkit = useMemo(() => {
    if (accountPkh && accountPublicKey && connectionType === 'beacon') {
      const cloneTezosToolkit = new TezosToolkit(tezos!.rpc);
      cloneTezosToolkit.setPackerProvider(michelEncoder);
      cloneTezosToolkit.setSignerProvider(new ReadOnlySigner(accountPkh, accountPublicKey));

      return cloneTezosToolkit;
    }

    return tezos;
  }, [tezos, connectionType, accountPkh, accountPublicKey]);

  return {
    connectionType,
    estimationToolkit,
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
    searchCustomBaker
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
  useEstimationToolkit
] = constate(
  useDApp,
  v => v.connectionType,
  v => v.tezos,
  v => v.accountPkh,
  v => v.templeWallet,
  v => v.ready,
  v => v.network,
  v => v.tokens,
  v => v.searchTokens,
  v => v.bakers,
  v => v.searchBakers,
  v => v.connectWithBeacon,
  v => v.connectWithTemple,
  v => v.disconnect,
  v => v.changeNetwork,
  v => v.addCustomToken,
  v => v.searchCustomToken,
  v => v.addCustomBaker,
  v => v.searchCustomBaker,
  v => v.estimationToolkit
);
