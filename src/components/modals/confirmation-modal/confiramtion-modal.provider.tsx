import { FC } from 'react';

import { ConfirmationModal } from './confirmation-modal';
import { ConfirmationModalConstateProvider } from './use-confirmation-modal';

export const ConfiramtionModalProvider: FC = ({ children }) => {
  return (
    <ConfirmationModalConstateProvider>
      {children}
      <ConfirmationModal />
    </ConfirmationModalConstateProvider>
  );
};
