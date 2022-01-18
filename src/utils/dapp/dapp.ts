import { useCallback, useEffect, useMemo, useState } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import constate from 'constate';
import useSWR from 'swr';

import { APP_NAME, LAST_USED_ACCOUNT_KEY, LAST_USED_CONNECTION_KEY } from '@app.config';
import { QSMainNet, QSNetwork } from '@utils/types';

import { beaconWallet, connectWalletBeacon } from './connect-wallet/connect-beacon-wallet';
import { connectWalletTemple } from './connect-wallet/connect-temple-wallet';
import { getTempleWalletState } from './connect-wallet/get-temple-wallet-state';
import { michelEncoder } from './connect-wallet/michel-encoder';
import { rpcClients } from './connect-wallet/rpc-clients';
import { getNetwork, setNetwork } from './network';
import { ReadOnlySigner } from './ReadOnlySigner';

const net = getNetwork();

export interface DAppType {
  connectionType: 'beacon' | 'temple' | null;
  tezos: TezosToolkit | null;
  accountPkh: string | null;
  accountPublicKey: string | null;
  templeWallet: TempleWallet | null;
  network: QSNetwork;
}

export const fallbackToolkits: Record<QSMainNet, TezosToolkit> = {
  hangzhounet: new TezosToolkit(rpcClients.hangzhounet),
  mainnet: new TezosToolkit(rpcClients.mainnet)
};

Object.values(fallbackToolkits).forEach(toolkit => toolkit.setPackerProvider(michelEncoder));

function useDApp() {
  const [{ accountPublicKey, connectionType, tezos, accountPkh, templeWallet, network }, setState] = useState<DAppType>(
    {
      connectionType: null,
      tezos: null,
      accountPkh: null,
      accountPublicKey: null,
      templeWallet: null,
      network: net
    }
  );

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
    connectWithBeacon,
    connectWithTemple,
    disconnect,
    changeNetwork
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
  useConnectWithBeacon,
  useConnectWithTemple,
  useDisconnect,
  useChangeNetwork,
  useEstimationToolkit
] = constate(
  useDApp,
  v => v.connectionType,
  v => v.tezos,
  v => v.accountPkh,
  v => v.templeWallet,
  v => v.ready,
  v => v.network,
  v => v.connectWithBeacon,
  v => v.connectWithTemple,
  v => v.disconnect,
  v => v.changeNetwork,
  v => v.estimationToolkit
);
