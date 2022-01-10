import { Standard } from '@graphql';

export const getStandardValue = (standard: Standard) => {
  switch (standard) {
    case Standard.Fa2:
      return 'FA2';
    case Standard.Fa12:
      return 'FA12';
    default:
      return undefined;
  }
};
