import { MichelsonData } from '@taquito/michel-codec';

import { SortTokensContractsType } from '@shared/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const taquitoUtils = require('@taquito/utils');

export const getValidMichelTemplate = ({
  addressA,
  addressB,
  type,
  idA,
  idB
}: SortTokensContractsType): MichelsonData => {
  const tokenAAddressBytes = taquitoUtils.b58decode(addressA);
  const tokenBAddressBytes = taquitoUtils.b58decode(addressB);

  switch (type) {
    case 'Left-Left':
      return {
        prim: 'Pair',
        args: [
          {
            prim: 'Left',
            args: [{ bytes: tokenAAddressBytes }]
          },
          {
            prim: 'Left',
            args: [{ bytes: tokenBAddressBytes }]
          }
        ]
      };
    case 'Left-Right':
      return {
        prim: 'Pair',
        args: [
          {
            prim: 'Left',
            args: [{ bytes: tokenAAddressBytes }]
          },
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [{ bytes: tokenBAddressBytes }, { int: `${idB}` }]
              }
            ]
          }
        ]
      };
    case 'Right-Right':
      return {
        prim: 'Pair',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [{ bytes: tokenAAddressBytes }, { int: `${idA}` }]
              }
            ]
          },
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [{ bytes: tokenBAddressBytes }, { int: `${idB}` }]
              }
            ]
          }
        ]
      };

    default:
      throw Error(`Not Valid Token Type: ${type}`);
  }
};
