import { useRef } from 'react';

import { getRandomId } from '../helpers';

export const useSvgHelper = (svgName: string) => {
  const iconId = useRef(getRandomId());
  const id = iconId.current;

  const getId = (name: string) => `${svgName}-${id}-${name}`;
  const getHash = (name: string) => `#${getId(name)}`;
  const getUrl = (name: string) => `url(${getHash(name)})`;

  return {
    id,
    getId,
    getHash,
    getUrl
  };
};
