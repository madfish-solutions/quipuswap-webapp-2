import { checkTabForAddOrRemove } from './check-tab-for-add-or-remove';

export const checkForAddOrRemoveInUrlParts = (urlParts: Array<string>) => urlParts.some(checkTabForAddOrRemove);
