import { FormikErrors, FormikTouched } from 'formik';

import { Undefined } from '@shared/types';

export const getFormikError = <E extends { [key: string]: string }, T extends { [key: string]: boolean }>(
  { errors, touched }: { errors: FormikErrors<E>; touched: FormikTouched<T> },
  key: string
): Undefined<string> => (errors[key] && touched[key] ? errors[key] : undefined) as Undefined<string>;
