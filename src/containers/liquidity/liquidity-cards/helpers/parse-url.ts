const TAB_URL_INDEX = 2;
const TOKENS_URL_INDEX = 3;

const FIRST_TOKEN_INDEX = 0;
const SECOND_TOKEN_INDEX = 1;

export const parseUrl = (url: string) => {
  const tokens = url?.split('/');
  const tabId = tokens?.[TAB_URL_INDEX];
  const tokensUrl = tokens?.[TOKENS_URL_INDEX]?.split('-');
  const tokenAFromUrl = tokensUrl?.[FIRST_TOKEN_INDEX];
  const tokenBFromUrl = tokensUrl?.[SECOND_TOKEN_INDEX];

  const [contractTokenA, idTokenA] = tokenAFromUrl?.split('_');
  const [contractTokenB, idTokenB] = tokenBFromUrl?.split('_');

  return {
    tabId,
    contractTokenA,
    idTokenA,
    contractTokenB,
    idTokenB
  };
};
