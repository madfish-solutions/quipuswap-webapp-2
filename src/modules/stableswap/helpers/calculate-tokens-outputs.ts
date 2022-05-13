export const calculateTokensOutputs = (
  amount_in_x: number,
  total_supply: number,
  reserves_x: number,
  reserves_y: number,
  reserves_z: number,
  reserves_w: number
) => {
  const shares_out = (amount_in_x * total_supply) / reserves_x;
  const amount_y = (shares_out * reserves_y) / total_supply;
  const amount_z = (shares_out * reserves_z) / total_supply;
  const amount_w = (shares_out * reserves_w) / total_supply;

  return [amount_y, amount_z, amount_w];
};
