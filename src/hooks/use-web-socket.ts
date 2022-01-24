import { useEffect, useRef, useState } from 'react';

import { useToasts } from '@hooks/use-toasts';

interface ReturnType<T> {
  data: T;
  hasFailed: boolean;
  loading: boolean;
}

export function useWebSocket<T>(webSocketUrl: string): ReturnType<T | undefined>;
export function useWebSocket<T>(webSocketUrl: string, defaultData: T): ReturnType<T>;
export function useWebSocket<T>(webSocketUrl: string, defaultData?: T) {
  const webSocketRef = useRef<WebSocket>();

  const { showErrorToast } = useToasts();

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setLoading(true);
    webSocketRef.current = new WebSocket(webSocketUrl);

    webSocketRef.current.onerror = (errorEvent: Event) => {
      showErrorToast(`Caught error of type ${errorEvent.type} from socket ${webSocketUrl}`);
      setHasFailed(true);
      setLoading(false);
    };

    webSocketRef.current.onmessage = (event: MessageEvent<string>) => {
      const parsedData: T = JSON.parse(event.data);
      setData(parsedData);
      setLoading(false);
    };

    return () => webSocketRef.current?.close();
  }, [webSocketUrl, showErrorToast]);

  return { data, hasFailed, loading };
}
