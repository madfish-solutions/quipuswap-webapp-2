import { FC } from 'react';

import { DashPlug, DashPlugProps } from '@components/ui/dash-plug';

export interface DashPlugFallbackProps extends Omit<DashPlugProps, 'animation'> {
  isLoading?: boolean;
}

export const DashPlugFallback: FC<DashPlugFallbackProps> = ({ isLoading, ...restProps }) => (
  <DashPlug {...restProps} animation={isLoading} />
);
