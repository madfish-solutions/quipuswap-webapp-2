import { TZKT_EXPLORER_URL } from '@config/config';
import { getWhitelistedBakerName, isExist } from '@shared/helpers';
import { Nullable, WhitelistedBaker } from '@shared/types';

import { Button } from '../button';
import { DashPlug } from '../dash-plug';

interface CandidateButtonProps {
  candidate: Nullable<WhitelistedBaker>;
}

export const CandidateButton = ({ candidate }: CandidateButtonProps) => {
  if (!isExist(candidate) || !isExist(candidate.address)) {
    return <DashPlug animation={false} />;
  }

  const url = `${TZKT_EXPLORER_URL}/${candidate.address}`;

  return (
    <Button
      href={url}
      external
      theme="underlined"
      title={getWhitelistedBakerName(candidate)}
      data-test-id="candidateButton"
    >
      {getWhitelistedBakerName(candidate)}
    </Button>
  );
};
