import { FC } from 'react';

import { ConfirmationModal } from './confirmation-modal';
import { ConfirmationModalConstateProvider } from './use-confirmation-modal';

export const ConfirmationModalProvider: FC = ({ children }) => {
  return (
    <ConfirmationModalConstateProvider>
      {children}
      <ConfirmationModal />
    </ConfirmationModalConstateProvider>
  );
};
