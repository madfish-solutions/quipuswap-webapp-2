import { useCallback, useEffect, useMemo, useState } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import constate from 'constate';
import useSWR from 'swr';

import { NETWORK } from '@config/config';
import { APP_NAME, NETWORK_ID, networksBaseUrls } from '@config/enviroment';
import { LAST_USED_ACCOUNT_KEY, LAST_USED_CONNECTION_KEY } from '@config/localstorage';
import {
  beaconWallet,
  connectWalletBeacon,
  connectWalletTemple,
  getTempleWalletState,
  michelEncoder,
  ReadOnlySigner,
  rpcClients
} from '@shared/helpers';
import { LastUsedConnectionKey, Nullable, QSNets, QSNetwork } from '@shared/types';

export interface DAppType {
  connectionType: Nullable<LastUsedConnectionKey>;
  tezos: Nullable<TezosToolkit>;
  accountPkh: Nullable<string>;
  accountPublicKey: Nullable<string>;
  templeWallet: Nullable<TempleWallet>;
  isLoading: boolean;
}

export const fallbackToolkits: Record<QSNets, TezosToolkit> = {
  [QSNets.mainnet]: new TezosToolkit(rpcClients.mainnet),
  [QSNets.hangzhounet]: new TezosToolkit(rpcClients.hangzhounet),
  [QSNets.ithacanet]: new TezosToolkit(rpcClients.ithacanet)
};

Object.values(fallbackToolkits).forEach(toolkit => toolkit.setPackerProvider(michelEncoder));

function useDApp() {
  const [{ accountPublicKey, connectionType, tezos, accountPkh, templeWallet, isLoading }, setState] =
    useState<DAppType>({
      connectionType: null,
      tezos: null,
      accountPkh: null,
      accountPublicKey: null,
      templeWallet: null,
      isLoading: true
    });

  const setFallbackState = useCallback(
    () =>
      setState(prevState => ({
        ...prevState,
        connectionType: null,
        tezos: prevState.tezos ?? fallbackToolkits[NETWORK_ID]
      })),
    []
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
          setState(prevState => ({ ...prevState, isLoading: true }));
          try {
            perm = await TempleWallet.getCurrentPermission();
          } catch (error) {
            // eslint-disable-next-line
            console.error(error);
          }

          const wlt = new TempleWallet(APP_NAME, lastUsedConnection === LastUsedConnectionKey.TEMPLE ? perm : null);

          if (lastUsedConnection === LastUsedConnectionKey.TEMPLE) {
            const { pkh, pk, tezos: _tezos } = await getTempleWalletState(wlt, NETWORK_ID);
            setState(prevState => ({
              ...prevState,
              templeWallet: wlt,
              tezos: _tezos,
              accountPkh: pkh,
              accountPublicKey: pk,
              connectionType: wlt.connected ? LastUsedConnectionKey.TEMPLE : null
            }));
          } else {
            setState(prevState => ({
              ...prevState,
              tezos: prevState.tezos ?? fallbackToolkits[NETWORK_ID],
              templeWallet: wlt
            }));
          }

          return;
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        } finally {
          setState(prevState => ({ ...prevState, isLoading: false }));
        }
      }

      if (lastUsedConnection !== LastUsedConnectionKey.BEACON) {
        setFallbackState();
      }
    });
    const lastUsedAccount = localStorage.getItem(LAST_USED_ACCOUNT_KEY);
    if (localStorage.getItem(LAST_USED_CONNECTION_KEY) === LastUsedConnectionKey.BEACON && lastUsedAccount) {
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

          const toolkit = new TezosToolkit(rpcClients[NETWORK_ID]);
          toolkit.setPackerProvider(michelEncoder);
          toolkit.setWalletProvider(beaconWallet);

          setState(prevState => ({
            ...prevState,
            templeWallet: null,
            accountPkh: value.address,
            accountPublicKey: value.publicKey,
            connectionType: LastUsedConnectionKey.BEACON,
            tezos: toolkit,
            network: NETWORK
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
    if (
      templeInitialAvailable === false &&
      localStorage.getItem(LAST_USED_CONNECTION_KEY) === LastUsedConnectionKey.TEMPLE
    ) {
      setFallbackState();
    }
  }, [setFallbackState, templeInitialAvailable]);

  useEffect(() => {
    if (!tezos || tezos.rpc.getRpcUrl() !== NETWORK.rpcBaseURL) {
      const wlt = new TempleWallet(APP_NAME, null);
      const fallbackTzTk = fallbackToolkits[NETWORK_ID];
      setState(prevState => ({
        ...prevState,
        templeWallet: wlt,
        tezos: fallbackTzTk,
        accountPkh: null,
        accountPublicKey: null,
        connectionType: null
      }));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (templeWallet && templeWallet.connected) {
      TempleWallet.onPermissionChange(perm => {
        if (!perm) {
          setState(prevState => ({
            ...prevState,
            templeWallet: new TempleWallet(APP_NAME),
            tezos: fallbackToolkits[NETWORK_ID],
            accountPkh: null,
            accountPublicKey: null,
            connectionType: null
          }));
        }
      });
    }
  }, [templeWallet]);

  const connectWithTemple = useCallback(async (forcePermission: boolean) => {
    const { pkh, pk, toolkit, wallet } = await connectWalletTemple(forcePermission, NETWORK);
    setState(prevState => ({
      ...prevState,
      connectionType: LastUsedConnectionKey.TEMPLE,
      tezos: toolkit,
      accountPkh: pkh,
      accountPublicKey: pk,
      templeWallet: wallet,
      isLoading: false
    }));
  }, []);

  const connectWithBeacon = useCallback(async (forcePermission: boolean) => {
    const { pkh, pk, toolkit } = await connectWalletBeacon(forcePermission, NETWORK);

    setState(prevState => ({
      ...prevState,
      connectionType: LastUsedConnectionKey.BEACON,
      tezos: toolkit,
      accountPkh: pkh,
      accountPublicKey: pk,
      templeWallet: null,
      isLoading: false
    }));
  }, []);

  const disconnect = useCallback(async () => {
    setState(prevState => ({
      ...prevState,
      tezos: fallbackToolkits[NETWORK_ID],
      accountPkh: null,
      accountPublicKey: null,
      connectionType: null
    }));
    localStorage.removeItem(LAST_USED_CONNECTION_KEY);
  }, []);

  const changeNetwork = useCallback((networkNew: QSNetwork) => {
    if (networkNew.id === NETWORK_ID) {
      return;
    }

    window.location.href = `${networksBaseUrls[networkNew.id]}/`;

    setState(prevState => ({
      ...prevState,
      accountPkh: null,
      accountPublicKey: null,
      connectionType: null,
      tezos: fallbackToolkits[networkNew.id],
      isLoading: false
    }));
  }, []);

  const estimationToolkit = useMemo(() => {
    if (accountPkh && accountPublicKey && connectionType === LastUsedConnectionKey.BEACON) {
      if (!tezos?.rpc) {
        throw new Error('Tezos RPC in undefined');
      }
      const cloneTezosToolkit = new TezosToolkit(tezos.rpc);
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
    isLoading,
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
  useConnectWithBeacon,
  useConnectWithTemple,
  useDisconnect,
  useChangeNetwork,
  useEstimationToolkit,
  useIsLoading
] = constate(
  useDApp,
  v => v.connectionType,
  v => v.tezos,
  v => v.accountPkh,
  v => v.templeWallet,
  v => v.ready,
  v => v.connectWithBeacon,
  v => v.connectWithTemple,
  v => v.disconnect,
  v => v.changeNetwork,
  v => v.estimationToolkit,
  v => v.isLoading
);
