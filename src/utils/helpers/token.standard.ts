import { Standard } from '@graphql';

export const getStandardValue = (standard: Standard) => {
  switch (standard) {
    case Standard.Fa2:
      return 'fa2';
    case Standard.Fa12:
      return 'fa1.2';
    default:
      return undefined;
  }
};
