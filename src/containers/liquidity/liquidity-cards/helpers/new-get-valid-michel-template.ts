import { MichelsonData } from '@taquito/michel-codec';

import { Token } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const taquitoUtils = require('@taquito/utils');

interface GetValidMichelTemplate {
  tokenA: Token;
  tokenB: Token;
  type: string;
}

export const newGetValidMichelTemplate = ({ tokenA, tokenB, type }: GetValidMichelTemplate): MichelsonData => {
  const tokenAAddressBytes = taquitoUtils.b58decode(tokenA.contractAddress);
  const tokenBAddressBytes = taquitoUtils.b58decode(tokenB.contractAddress);
  const tokenAId = tokenA.fa2TokenId?.toString() ?? '';
  const tokenBId = tokenB.fa2TokenId?.toString() ?? '';

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
                args: [{ bytes: tokenBAddressBytes }, { int: tokenBId }]
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
                args: [{ bytes: tokenAAddressBytes }, { int: tokenAId }]
              }
            ]
          },
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [{ bytes: tokenBAddressBytes }, { int: tokenBId }]
              }
            ]
          }
        ]
      };

    default:
      throw Error(`Not Valid Token Type: ${type}`);
  }
};
