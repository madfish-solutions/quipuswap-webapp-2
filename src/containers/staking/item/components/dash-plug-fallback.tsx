import { FC } from 'react';

import { DashPlug, DashPlugProps } from '@components/ui/dash-plug';

interface Props extends Omit<DashPlugProps, 'animation'> {
  isLoading?: boolean;
}

export const DashPlugFallback: FC<Props> = ({ isLoading, ...restProps }) => (
  <DashPlug {...restProps} animation={isLoading} />
);
