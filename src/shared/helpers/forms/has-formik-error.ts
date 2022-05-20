import { FormikErrors } from 'formik';

const ZERO_ERRORS = 0;

export const hasFormikError = <T>(errors: FormikErrors<T>): boolean => Object.keys(errors).length > ZERO_ERRORS;
