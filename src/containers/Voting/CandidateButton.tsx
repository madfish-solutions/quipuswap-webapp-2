import React from 'react';

import { Button } from '@quipuswap/ui-kit';

import { DASH_CHAR, TZKT_EXPLORER_URL } from '@app.config';
import { getWhitelistedBakerName } from '@utils/helpers';
import { Undefined, WhitelistedBaker } from '@utils/types';

interface CandidateButtonProps {
  candidate: Undefined<WhitelistedBaker>;
}

export const CandidateButton = ({ candidate }: CandidateButtonProps) => {
  if (!candidate) {
    return <div> ${DASH_CHAR} </div>;
  }

  const url = `${TZKT_EXPLORER_URL}/${candidate.address}`;

  return (
    <Button href={url} external theme="underlined" title={getWhitelistedBakerName(candidate)}>
      {getWhitelistedBakerName(candidate)}
    </Button>
  );
};
