import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RpcClientInterface } from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import constate from 'constate';
import useSWR from 'swr';

import { APP_NAME, NETWORK } from '@config/config';
import { MS_IN_MINUTES } from '@config/constants';
import { NETWORK_ID, networksBaseUrls, RPC_URLS } from '@config/environment';
import { LAST_USED_ACCOUNT_KEY, LAST_USED_CONNECTION_KEY, PREFERRED_RPC_URL } from '@config/localstorage';
import {
  beaconWallet,
  connectWalletBeacon,
  connectWalletTemple,
  FastRpcClient,
  getPreferredRpcUrl,
  getTempleWalletState,
  michelEncoder,
  ReadOnlySigner
} from '@shared/helpers';
import { LastUsedConnectionKey, Nullable, QSNetwork } from '@shared/types';

export interface DAppType {
  connectionType: Nullable<LastUsedConnectionKey>;
  tezos: Nullable<TezosToolkit>;
  accountPkh: Nullable<string>;
  accountPublicKey: Nullable<string>;
  templeWallet: Nullable<TempleWallet>;
  isLoading: boolean;
}

export function makeBasicToolkit(clientOrUrl?: RpcClientInterface | string) {
  const tezos = new TezosToolkit(clientOrUrl ?? new FastRpcClient(getPreferredRpcUrl()));
  tezos.setPackerProvider(michelEncoder);

  return tezos;
}

const BLOCK_POLLING_INTERVAL = 5000;
const MAX_BLOCK_REQUEST_TIME = 7500;
const DISCONNECTION_TIMEOUT = MS_IN_MINUTES;
const RPC_URLS_INDEX_INCREMENT = 1;

class BlockRequestTimeoutError extends Error {
  constructor() {
    super(`Block request timed out after ${MAX_BLOCK_REQUEST_TIME} ms`);
  }
}

// TODO: reduce cognitive complexity
// eslint-disable-next-line sonarjs/cognitive-complexity
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
        tezos: prevState.tezos ?? makeBasicToolkit()
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
              tezos: prevState.tezos ?? makeBasicToolkit(),
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

          const toolkit = makeBasicToolkit();
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
    if (!tezos || tezos.rpc.getRpcUrl() !== getPreferredRpcUrl()) {
      const wlt = new TempleWallet(APP_NAME, null);
      const fallbackTzTk = makeBasicToolkit();
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
            tezos: makeBasicToolkit(),
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

  const disconnect = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      tezos: makeBasicToolkit(),
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
      tezos: makeBasicToolkit(),
      isLoading: false
    }));
  }, []);

  const estimationToolkit = useMemo(() => {
    if (accountPkh && accountPublicKey && connectionType === LastUsedConnectionKey.BEACON) {
      if (!tezos?.rpc) {
        throw new Error('Tezos RPC in undefined');
      }
      const cloneTezosToolkit = makeBasicToolkit(tezos.rpc);
      cloneTezosToolkit.setSignerProvider(new ReadOnlySigner(accountPkh, accountPublicKey));

      return cloneTezosToolkit;
    }

    return tezos;
  }, [tezos, connectionType, accountPkh, accountPublicKey]);

  const blockSubscriptions = useRef(new Set<(hash: string) => void>());
  const subscribeToBlock = useCallback((cb: (hash: string) => void) => {
    blockSubscriptions.current.add(cb);
  }, []);
  const unsubscribeFromBlock = useCallback((cb: (hash: string) => void) => {
    blockSubscriptions.current.delete(cb);
  }, []);

  const lastBlockFetchSuccessTimestampRef = useRef<number>(Date.now());
  const [shouldReconnect, setShouldReconnect] = useState(false);

  const currentRpcUrl = tezos ? tezos.rpc.getRpcUrl() : getPreferredRpcUrl();
  const nextRpcUrl = useMemo(() => {
    const currentRpcUrlIndex = RPC_URLS.indexOf(currentRpcUrl);
    const newRpcUrlIndex = (currentRpcUrlIndex + RPC_URLS_INDEX_INCREMENT) % RPC_URLS.length;

    return RPC_URLS[newRpcUrlIndex];
  }, [currentRpcUrl]);

  const reconnect = useCallback(async () => {
    if (!tezos) {
      return;
    }

    localStorage.setItem(PREFERRED_RPC_URL, nextRpcUrl);
    setShouldReconnect(false);
    lastBlockFetchSuccessTimestampRef.current = Date.now();
    if (accountPkh) {
      const lastUsedConnection = localStorage.getItem(LAST_USED_CONNECTION_KEY);
      disconnect();
      if (lastUsedConnection === LastUsedConnectionKey.TEMPLE) {
        await connectWithTemple(true);
      } else {
        await connectWithBeacon(true);
      }
    } else {
      setState(prevState => ({
        ...prevState,
        connectionType: null,
        tezos: makeBasicToolkit()
      }));
    }
  }, [tezos, accountPkh, nextRpcUrl, disconnect, connectWithTemple, connectWithBeacon]);

  const blockHashRef = useRef<string>();
  useEffect(() => {
    if (!tezos) {
      return () => undefined;
    }

    const blockPollingInterval = setInterval(async () => {
      try {
        const requestStartTime = Date.now();
        const blockHash = await tezos.rpc.getBlockHash();
        const requestEndTime = Date.now();
        lastBlockFetchSuccessTimestampRef.current = requestEndTime;
        if (requestEndTime - requestStartTime > MAX_BLOCK_REQUEST_TIME) {
          throw new BlockRequestTimeoutError();
        }

        if (blockHash !== blockHashRef.current) {
          blockHashRef.current = blockHash;
          blockSubscriptions.current.forEach(cb => cb(blockHash));
        }
      } catch (e) {
        if (e instanceof BlockRequestTimeoutError) {
          setShouldReconnect(true);
        } else {
          const now = Date.now();
          const lastBlockFetchSuccessTimestamp = lastBlockFetchSuccessTimestampRef.current;
          if (now - lastBlockFetchSuccessTimestamp > DISCONNECTION_TIMEOUT) {
            setShouldReconnect(true);
          }
        }
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }, BLOCK_POLLING_INTERVAL);

    return () => clearInterval(blockPollingInterval);
  }, [tezos]);

  const rejectReconnection = useCallback(() => {
    setShouldReconnect(false);
    lastBlockFetchSuccessTimestampRef.current = Date.now();
  }, []);

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
    changeNetwork,
    subscribeToBlock,
    unsubscribeFromBlock,
    shouldReconnect,
    currentRpcUrl,
    nextRpcUrl,
    reconnect,
    rejectReconnection
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
  useIsLoading,
  useSubscribeToBlock,
  useUnsubscribeFromBlock,
  useShouldReconnect,
  useCurrentRpcUrl,
  useNextRpcUrl,
  useReconnect,
  useRejectReconnection
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
  v => v.isLoading,
  v => v.subscribeToBlock,
  v => v.unsubscribeFromBlock,
  v => v.shouldReconnect,
  v => v.currentRpcUrl,
  v => v.nextRpcUrl,
  v => v.reconnect,
  v => v.rejectReconnection
);
