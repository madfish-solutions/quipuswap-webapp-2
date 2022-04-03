import { TZKT_EXPLORER_URL } from '@config/config';
import { Button } from '@shared/components/button';
import { DashPlug } from '@shared/components/dash-plug';
import { getWhitelistedBakerName, isExist } from '@shared/helpers';
import { Nullable, WhitelistedBaker } from '@shared/types';

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
