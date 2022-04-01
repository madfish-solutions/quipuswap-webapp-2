import { FC } from 'react';

import { DashPlugProps, DashPlug } from '@shared/components';

export interface DashPlugFallbackProps extends Omit<DashPlugProps, 'animation'> {
  isLoading?: boolean;
}

export const DashPlugFallback: FC<DashPlugFallbackProps> = ({ isLoading, ...restProps }) => (
  <DashPlug {...restProps} animation={isLoading} />
);
