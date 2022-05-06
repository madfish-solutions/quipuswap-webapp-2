import { useRef } from 'react';

import { getRandomId } from '../helpers';

export const useSvgHelper = (svgName: string) => {
  const randomId = useRef(getRandomId());

  const getId = (name: string) => `${svgName}-${randomId.current}-${name}`;
  const getHash = (name: string) => `#${getId(name)}`;
  const getUrl = (name: string) => `url(${getHash(name)})`;

  return {
    id: randomId.current,
    getId,
    getHash,
    getUrl
  };
};
