import { MichelsonData } from '@taquito/michel-codec';

import { SortTokensContractsType } from '@utils/types';

const taquitoUtils = require('@taquito/utils');

export const getValidMichelTemplate = ({ addressA, addressB, type }: SortTokensContractsType): MichelsonData => {
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
                args: [{ bytes: tokenBAddressBytes }, { int: '0' }]
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
                args: [{ bytes: tokenAAddressBytes }, { int: '0' }]
              }
            ]
          },
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [{ bytes: tokenBAddressBytes }, { int: '0' }]
              }
            ]
          }
        ]
      };

    default:
      throw Error(`Not Valid Token Type: ${type}`);
  }
};
