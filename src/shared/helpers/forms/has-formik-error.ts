import { FormikErrors } from 'formik';

import { isEmptyArray } from '../arrays';

export const hasFormikError = <T>(errors: FormikErrors<T>): boolean => !isEmptyArray(Object.keys(errors));
