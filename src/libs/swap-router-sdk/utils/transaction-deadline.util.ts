const TRANSACTION_LIFE_MINUTES = 20;

export const getTransactionTimeoutDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + TRANSACTION_LIFE_MINUTES);

  return now.toISOString();
};
