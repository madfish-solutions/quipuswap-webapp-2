import { useParams } from 'react-router-dom';

export const useContractAddress = () => {
  const params = useParams();
  const data = params['*'] || '';
  const [tab, address] = data.split('/');

  return {
    tab,
    address
  };
};
