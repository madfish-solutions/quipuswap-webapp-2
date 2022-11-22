import { NOT_FOUND_LETTERS_ROUTE_NAME } from '@config/constants';

import { makeReplaceLastPathnameElementFn } from './make-replace-last-pathname-element-fn';

export const buildNotFoundLettersPagePathname = makeReplaceLastPathnameElementFn(NOT_FOUND_LETTERS_ROUTE_NAME);
