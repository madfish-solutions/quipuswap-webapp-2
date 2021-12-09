import { Button } from '@quipuswap/ui-kit';
import { getWhitelistedBakerName } from '@utils/helpers';
import { Undefined, WhitelistedBaker } from '@utils/types';
import React from 'react';

interface CandidateButtonProps {
  candidate: Undefined<WhitelistedBaker>;
}

export const CandidateButton = ({ candidate }: CandidateButtonProps) => {
  // eslint-disable-next-line react/no-unescaped-entities
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
