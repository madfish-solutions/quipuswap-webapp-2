import React from 'react';

import { TZKT_EXPLORER_URL } from '@app.config';
import { DashPlug } from '@components/ui/dash-plug';
import { Button } from '@components/ui/elements/button';
import { getWhitelistedBakerName, isExist } from '@utils/helpers';
import { Nullable, WhitelistedBaker } from '@utils/types';

interface CandidateButtonProps {
  candidate: Nullable<WhitelistedBaker>;
}

export const CandidateButton = ({ candidate }: CandidateButtonProps) => {
  if (!isExist(candidate) || !isExist(candidate.address)) {
    return <DashPlug animation={false} />;
  }

  const url = `${TZKT_EXPLORER_URL}/${candidate.address}`;

  return (
    <Button href={url} external theme="underlined" title={getWhitelistedBakerName(candidate)}>
      {getWhitelistedBakerName(candidate)}
    </Button>
  );
};
