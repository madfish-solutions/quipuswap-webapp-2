import { onlyDigitsAndSeparator } from './only-digits-and-separator';

export const onlyDigits = (value: string) => onlyDigitsAndSeparator(value).replaceAll('.', '');
