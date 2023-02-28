import { HttpResponseError } from '@taquito/http-utils';

import { isEmptyString } from '@shared/helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonFetch = async <T = any>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  const url = typeof input === 'string' ? input : input.url;

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

  return JSON.parse(rawJSON);
};
