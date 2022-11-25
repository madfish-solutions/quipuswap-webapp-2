import { NOT_FOUND_ROUTE_NAME } from '@config/constants';

import { makeReplaceLastPathnameElementFn } from './make-replace-last-pathname-element-fn';

export const buildNotFoundDigitsPagePathname = makeReplaceLastPathnameElementFn(NOT_FOUND_ROUTE_NAME);
