import { FC as TFC, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export type CFC<P = {}> = TFC<P & { children?: ReactNode }>;
export interface ClassNameProps {
  className?: string;
}
