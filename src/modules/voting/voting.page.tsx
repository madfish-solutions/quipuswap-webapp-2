import { FC } from 'react';

import { Navigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NOT_FOUND_ROUTE_NAME } from '@config/constants';
import { isInArray } from '@shared/helpers';

import { VotingProvider } from './helpers/voting.provider';
import { VotingTabs } from './tabs.enum';
import { VotingInner } from './voting-inner';

export const VotingPage: FC = () => {
  const params = useParams();
  const method = params.method ?? VotingTabs.vote;

  if (isInArray(method, Object.values(VotingTabs))) {
    return (
      <VotingProvider>
        <VotingInner />
      </VotingProvider>
    );
  }

  return <Navigate replace to={`${AppRootRoutes.Voting}/${NOT_FOUND_ROUTE_NAME}`} />;
};
