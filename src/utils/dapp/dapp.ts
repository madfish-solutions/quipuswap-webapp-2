import { useCallback, useEffect, useMemo, useState } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import constate from 'constate';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import {
  APP_NAME,
  LAST_USED_ACCOUNT_KEY,
  LAST_USED_CONNECTION_KEY,
  NETWORK,
  networksBaseUrls,
  NETWORK_ID
} from '@app.config';
import { isNull } from '@utils/helpers';
import { LastUsedConnectionKey, Nullable, QSNets, QSNetwork } from '@utils/types';

import { beaconWallet, connectWalletBeacon } from './connect-wallet/connect-beacon-wallet';
import { connectWalletTemple } from './connect-wallet/connect-temple-wallet';
import { getTempleWalletState } from './connect-wallet/get-temple-wallet-state';
import { michelEncoder } from './connect-wallet/michel-encoder';
import { rpcClients } from './connect-wallet/rpc-clients';
import { ReadOnlySigner } from './ReadOnlySigner';

export interface DAppType {
  connectionType: Nullable<LastUsedConnectionKey>;
  tezos: Nullable<TezosToolkit>;
  accountPkh: Nullable<string>;
  accountPublicKey: Nullable<string>;
  templeWallet: Nullable<TempleWallet>;
}

export const fallbackToolkits: Record<QSNets, TezosToolkit> = {
  hangzhounet: new TezosToolkit(rpcClients.hangzhounet),
  mainnet: new TezosToolkit(rpcClients.mainnet)
};

Object.values(fallbackToolkits).forEach(toolkit => toolkit.setPackerProvider(michelEncoder));

const URL_WITH_SLUGS_REGEX = /(.*)\/[a-z_0-9]+-[a-z_0-9]+/i;

function useDApp() {
  const router = useRouter();

  const [{ accountPublicKey, connectionType, tezos, accountPkh, templeWallet }, setState] = useState<DAppType>({
    connectionType: null,
    tezos: null,
    accountPkh: null,
    accountPublicKey: null,
    templeWallet: null
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
          try {
            perm = await TempleWallet.getCurrentPermission();
          } catch (error) {
            // eslint-disable-next-line
            console.log(error);
          }

          const wlt = new TempleWallet(APP_NAME, lastUsedConnection === LastUsedConnectionKey.TEMPLE ? perm : null);

          if (lastUsedConnection === LastUsedConnectionKey.TEMPLE) {
            const { pkh, pk, tezos } = await getTempleWalletState(wlt, NETWORK_ID);
            setState(prevState => ({
              ...prevState,
              templeWallet: wlt,
              tezos,
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
      templeWallet: wallet
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
      templeWallet: null
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

  const changeNetwork = useCallback(
    (networkNew: QSNetwork) => {
      if (networkNew.id === NETWORK_ID) {
        return;
      }

      const currentPath = router.asPath;
      const urlWithSlugsRegexResult = URL_WITH_SLUGS_REGEX.exec(currentPath);
      if (isNull(urlWithSlugsRegexResult)) {
        window.location.href = `${networksBaseUrls[networkNew.id]}${currentPath}`;
      } else {
        const basePath = urlWithSlugsRegexResult[1];
        window.location.href = `${networksBaseUrls[networkNew.id]}${basePath}`;
      }

      setState(prevState => ({
        ...prevState,
        accountPkh: null,
        accountPublicKey: null,
        connectionType: null,
        tezos: fallbackToolkits[networkNew.id]
      }));
    },
    [router.asPath]
  );

  const estimationToolkit = useMemo(() => {
    if (accountPkh && accountPublicKey && connectionType === LastUsedConnectionKey.BEACON) {
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
  useEstimationToolkit
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
  v => v.estimationToolkit
);
