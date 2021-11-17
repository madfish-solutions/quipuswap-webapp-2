import { useEffect, useState } from 'react';
import useSWR, {
  SWRConfiguration,
  Key,
  SWRResponse,
} from 'swr';

type SWRArgs<Data = any, Error = any> =
  | [Key, SWRConfiguration<Data, Error>?]
  | [
    Key,
    ((...args: any[]) => Data | Promise<Data>)?,
    SWRConfiguration<Data, Error>?,
  ];

function useContinuousSWR<Data = any, Error = any>(
  key: Key,
): SWRResponse<Data, Error>;
function useContinuousSWR<Data = any, Error = any>(
  key: Key,
  config?: SWRConfiguration<Data, Error>,
): SWRResponse<Data, Error>;
function useContinuousSWR<Data = any, Error = any>(
  key: Key,
  fn?: (...args: any[]) => Data | Promise<Data>,
  config?: SWRConfiguration<Data, Error>
): SWRResponse<Data, Error>;
function useContinuousSWR<Data = any, Error = any>(...args: SWRArgs<Data, Error>) {
  const {
    data,
    ...restProps
    // @ts-ignore
  } = useSWR<Data, Error>(...args);

  const [continuousData, setContinuousData] = useState(data);

  useEffect(() => {
    if (data !== undefined) {
      setContinuousData(data);
    }
  }, [data]);

  return {
    data: continuousData,
    ...restProps,
  };
}

export default useContinuousSWR;
