import { useParams } from 'react-router-dom';

import { SLASH, STAR } from '@config/constants';

export const useContractAddress = () => {
  const params = useParams();
  const data = params[STAR] || '';
  const [tab, address] = data.split(SLASH);

  return {
    tab,
    address
  };
};
