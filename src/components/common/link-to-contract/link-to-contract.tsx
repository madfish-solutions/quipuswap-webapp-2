import React, { FC } from 'react';

import { shortize } from '@utils/helpers';

import { Button } from '../../ui/elements/button';

interface Props {
  contractAddress: string;
  link: string;
}

export const LinkToContract: FC<Props> = ({ contractAddress, link }) => {
  return (
    <Button href={link} external theme="underlined">
      {shortize(contractAddress)}
    </Button>
  );
};
