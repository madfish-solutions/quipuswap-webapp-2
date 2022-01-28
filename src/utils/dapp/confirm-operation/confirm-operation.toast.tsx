import { FC } from 'react';

import { TZKT_EXPLORER_URL } from '@app.config';
import { Button } from '@components/ui/elements/button';
import { shortize } from '@utils/helpers';

import { ConfirmationToastProps } from './confirm-operation.types';

const ExplorerHashLink: FC<{ hash: string }> = ({ hash }) => {
  const link = `${TZKT_EXPLORER_URL}/${hash}`;
  const linkText = shortize(hash);

  return (
    <Button themeOposite href={link} external theme="underlined">
      {linkText}
    </Button>
  );
};

const TRANSACTION = 'Transaction';
const TRANSACTION_SEND = 'send to blockchain';
const TRANSACTION_CONFIMED = 'has been confirmed';

export const ConfirmationSuccessToast: FC<ConfirmationToastProps> = ({ hash, message }) => {
  return (
    <div>
      <div>{message}</div>
      <div>
        {TRANSACTION} <ExplorerHashLink hash={hash} /> {TRANSACTION_CONFIMED}
      </div>
    </div>
  );
};

export const TransactionSendedToast: FC<ConfirmationToastProps> = ({ hash }) => {
  return (
    <div>
      {TRANSACTION} <ExplorerHashLink hash={hash} /> {TRANSACTION_SEND}
    </div>
  );
};
