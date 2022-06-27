export const earningsMapSchema = {
  prim: 'map',
  args: [
    {
      prim: 'nat'
    },
    {
      prim: 'pair',
      args: [
        {
          prim: 'nat',
          annots: ['%reward_f']
        },
        {
          prim: 'nat',
          annots: ['%former_f']
        }
      ]
    }
  ]
};

export const rewardMapSchema = {
  prim: 'map',
  args: [{ prim: 'nat' }, { prim: 'nat' }]
};
