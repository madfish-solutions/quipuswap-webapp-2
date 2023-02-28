import { HttpResponseError, HttpRequestFailed } from '@taquito/http-utils';

import { isEmptyString } from '@shared/helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonFetch = async <T = any>(input: RequestInfo, init?: RequestInit, parser = JSON.parse): Promise<T> => {
  const { url, method = 'GET' } = typeof input === 'string' ? { url: input, method: 'GET' } : input;
  const response = await fetch(input, init).catch(e => {
    throw new HttpRequestFailed(`${method} ${url} ${e.message}`);
  });

  if (!response.ok) {
    throw new HttpResponseError(
      `Http error response: ${response.status}`,
      response.status,
      response.statusText,
      await response.text(),
      url
    );
  }

  const rawJSON = await response.text();

  if (isEmptyString(rawJSON)) {
    const mockResponseStatus = 404;
    throw new HttpResponseError(
      `Http error response: ${mockResponseStatus}`,
      mockResponseStatus,
      'Not Found',
      rawJSON,
      url
    );
  }

  return parser(rawJSON);
};
