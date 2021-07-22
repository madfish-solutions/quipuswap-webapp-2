import {
  METADATA_API,
} from '@utils/defaults';

export const getTokenMetadata = async (address:string) => {
  const data = await fetch(`${METADATA_API}/${address}/0`)
    .then((res) => res.json())
    .catch(() => ([]));

  return data;
};
