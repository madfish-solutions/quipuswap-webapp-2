import { useEffect, useState } from 'react';
import { GovernanceUserInfo } from '@utils/types';
import { useAccountPkh, useGovernanceContract } from '@utils/dapp';
import { useGovernance } from '@hooks/useGovernance';

export const useUsersVotes = () => {
  const { data: allProposals } = useGovernance();
  const governanceContract = useGovernanceContract();
  const accountPkh = useAccountPkh();
  const [userVotes, setUserVotes] = useState<GovernanceUserInfo[]>();

  useEffect(() => {
    const loadAmountOfTokensInFarms = async () => {
      const usersInfo:(
        Promise<GovernanceUserInfo | undefined> | undefined
      )[] = allProposals.map((currentProposal) => (
        governanceContract?.locked_balances.balances.get({
          account: accountPkh,
          proposal: currentProposal.id,
        })));

      const resolvedUserInfo = await Promise.all(usersInfo);
      if (resolvedUserInfo) {
        const resultUserInfo:any = {};

        for (let i = 0; i < allProposals.length; i++) {
          resultUserInfo[allProposals[i].id] = resolvedUserInfo[i];
        }
        setUserVotes(resultUserInfo);
      }
    };
    if (accountPkh) {
      loadAmountOfTokensInFarms();
    } else {
      setUserVotes([]);
    }
  }, [allProposals, accountPkh, governanceContract]);

  return userVotes;
};
