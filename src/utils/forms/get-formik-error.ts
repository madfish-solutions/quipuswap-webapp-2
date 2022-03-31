export const getFormikError = (
  { errors, touched }: { errors: { [key: string]: string }; touched: { [key: string]: boolean } },
  key: string
) => (errors[key] && touched[key] ? errors[key] : undefined);
