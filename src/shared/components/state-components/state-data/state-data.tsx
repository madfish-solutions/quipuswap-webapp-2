import { FC } from 'react';

import { DashPlug } from '@shared/components/dash-plug';
import { LedEntity } from '@shared/types';

interface FallbackProps {
  isLoading?: boolean;
}

export interface StateDataProps<T> {
  entity: LedEntity<T>;
  children: (data: T) => JSX.Element;
  Fallback?: FC<FallbackProps>;
}

const DefaultFallback: FC<FallbackProps> = ({ isLoading }) => <DashPlug animation={isLoading} />;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const StateData = <T extends unknown>({ entity, children, Fallback = DefaultFallback }: StateDataProps<T>) => {
  if (entity.loading) {
    return <Fallback isLoading />;
  }

  if (entity.error) {
    return <Fallback isLoading={false} />;
  }

  return children(entity.data);
};
