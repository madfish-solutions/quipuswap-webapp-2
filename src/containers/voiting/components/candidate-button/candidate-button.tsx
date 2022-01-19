import React from 'react';

import { Button } from '@quipuswap/ui-kit';

import { TZKT_EXPLORER_URL } from '@app.config';
import { DashPlug } from '@components/ui/dash-plug';
import { getWhitelistedBakerName, isExist } from '@utils/helpers';
import { Nullable, WhitelistedBaker } from '@utils/types';

interface CandidateButtonProps {
  candidate: Nullable<WhitelistedBaker>;
}

export const CandidateButton = ({ candidate }: CandidateButtonProps) => {
  if (!isExist(candidate) || !isExist(candidate.address)) {
    return <DashPlug animation={false} />;
  }
  // console.log(candidate)

  const url = `${TZKT_EXPLORER_URL}/${candidate.address}`;

  return (
    <Button href={url} external theme="underlined" title={getWhitelistedBakerName(candidate)}>
      {getWhitelistedBakerName(candidate)}
    </Button>
  );
};
