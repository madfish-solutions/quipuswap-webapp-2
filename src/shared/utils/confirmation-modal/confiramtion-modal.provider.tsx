import { CFC } from '@shared/types';

import { ConfirmationModal } from './confirmation-modal';
import { ConfirmationModalConstateProvider } from './use-confirmation-modal';

export const ConfirmationModalProvider: CFC = ({ children }) => {
  return (
    <ConfirmationModalConstateProvider>
      {children}
      <ConfirmationModal />
    </ConfirmationModalConstateProvider>
  );
};
