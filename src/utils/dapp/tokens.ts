import {
  MAINNET_TOKENS,
} from '@utils/defaults';

export const getTokens = async () => fetch(MAINNET_TOKENS.replace('ipfs://', 'https://ipfs.io/ipfs/'))
  .then((res) => res.json())
  .then((json) => {
    if (json.tokens && json.tokens.length === 0) {
      return [];
    }
    return json.tokens;
  })
  .catch(() => ([]));
