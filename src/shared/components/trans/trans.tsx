import { FC } from 'react';

interface Props {
  ns: string;
}

export const Trans: FC<Props> = ({ ns, children }) => <>{children}</>;
