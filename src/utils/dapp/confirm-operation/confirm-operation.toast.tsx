import { FC } from 'react';

import { shortize } from '@utils/helpers';

import { ConfirmationToastProps } from './confirm-operation.types';

export const ConfirmationSuccessToast: FC<ConfirmationToastProps> = ({ hash, message }) => {
  return (
    <div>
      <div>{ message }</div>
      <div>Transaction {shortize(hash)} has been confirmed</div>
    </div>
  );
};

export const TransactionSendedToast: FC<ConfirmationToastProps> = ({ hash }) => {
  return <div>Transaction {shortize(hash)} sended to blockchain</div>;
};
