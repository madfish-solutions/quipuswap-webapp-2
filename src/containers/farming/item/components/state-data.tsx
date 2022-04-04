import { FC } from 'react';

import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { DashPlugFallback } from './dash-plug-fallback';

interface FallbackProps {
  isLoading?: boolean;
}

interface Props<T> {
  isLoading?: boolean;
  data: Nullable<T>;
  children: (data: T) => JSX.Element;
  Fallback?: FC<FallbackProps>;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const StateData = <T extends unknown>({ isLoading, data, children, Fallback = DashPlugFallback }: Props<T>) =>
  isNull(data) ? <Fallback isLoading={isLoading} /> : children(data);
