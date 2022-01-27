import { Dispatch, useEffect, useRef, useState } from 'react';

interface SuccessReturnType<T> {
  data: T;
  errorEvent: null;
  initLoading: false;
}

interface ErrorReturnType {
  data: null;
  errorEvent: Event;
  initLoading: false;
}

interface InitLoadingReturnType {
  data: null;
  errorEvent: null;
  initLoading: true;
}

type ReturnType<T> = SuccessReturnType<T> | ErrorReturnType | InitLoadingReturnType;

export function useWebSocket<T>(
  webSocketUrl: string,
  onSuccess?: Dispatch<T>,
  onError?: Dispatch<Event>
): ReturnType<T> {
  const webSocketRef = useRef<WebSocket>();

  const [state, setState] = useState<ReturnType<T>>({ data: null, errorEvent: null, initLoading: true });
  const initLoadingRef = useRef(true);

  useEffect(() => {
    setState({ data: null, errorEvent: null, initLoading: true });
    initLoadingRef.current = true;
    webSocketRef.current = new WebSocket(webSocketUrl);

    webSocketRef.current.onerror = (errorEvent: Event) => {
      setState({ data: null, errorEvent, initLoading: false });
      initLoadingRef.current = false;
      onError?.(errorEvent);
    };

    webSocketRef.current.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data);
      setState({ data, errorEvent: null, initLoading: false });
      if (initLoadingRef.current) {
        initLoadingRef.current = false;
        onSuccess?.(data);
      }
    };

    return () => webSocketRef.current?.close();
  }, [webSocketUrl, onSuccess, onError]);

  return state;
}
