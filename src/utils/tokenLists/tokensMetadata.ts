export const getTokenMetadata = async (network: string, address:string, tokenId?:number) => {
  const data = await fetch(`${network}/${address}/${tokenId || 0}`)
    .then((res) => res.json())
    .catch(() => (null));

  if (data?.message) return null;
  return data;
};
