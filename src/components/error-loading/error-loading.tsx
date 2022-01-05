import { FC, ReactElement } from 'react';

export interface ErrorLoadingWrapperProps {
  isLoading: boolean;
  fallback: ReactElement;
}

export const ErrorLoadingWrapper: FC<ErrorLoadingWrapperProps> = ({ children, isLoading, fallback }) => {
  if (isLoading) {
    return fallback;
  }

  return <>{children}</>;
};
