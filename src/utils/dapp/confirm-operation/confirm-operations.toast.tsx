import { FC } from 'react';

import { shortize } from '@utils/helpers';

import { ConfirmationToastProps } from './confirm-operation.types';

export const ConfirmationSuccessToast: FC<ConfirmationToastProps> = ({ hash }) => {
  return <div>Transaction {shortize(hash)} has been confirmed</div>;
};

export const TransactionSendedToast: FC<ConfirmationToastProps> = ({ hash }) => {
  return <div>Transaction {shortize(hash)} sended to blockchain</div>;
};
