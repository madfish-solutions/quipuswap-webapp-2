import React from 'react';

import { Button } from '@quipuswap/ui-kit';

import { getWhitelistedBakerName } from '@utils/helpers';
import { Undefined, WhitelistedBaker } from '@utils/types';

interface CandidateButtonProps {
  candidate: Undefined<WhitelistedBaker>;
}

export const CandidateButton = ({ candidate }: CandidateButtonProps) => {
  if (!candidate) return <div> — </div>;

  return (
    <Button
      href={`https://tzkt.io/${candidate.address}`}
      external
      theme="underlined"
      title={getWhitelistedBakerName(candidate)}
    >
      {getWhitelistedBakerName(candidate)}
    </Button>
  );
};
