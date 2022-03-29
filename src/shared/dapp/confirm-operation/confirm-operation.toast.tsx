import { FC } from 'react';

import { TZKT_EXPLORER_URL } from '@config';
import { Button } from '@shared/components/button';
import { shortize } from '@shared/helpers/shortize';

import { ConfirmationToastProps } from './confirm-operation.types';

const ExplorerHashLink: FC<{ hash: string }> = ({ hash }) => {
  const link = `${TZKT_EXPLORER_URL}/${hash}`;
  const linkText = shortize(hash);

  return (
    <Button href={link} external theme="underlined">
      {linkText}
    </Button>
  );
};

const TRANSACTION = 'Transaction';
const TRANSACTION_SEND = 'sent to blockchain';
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
