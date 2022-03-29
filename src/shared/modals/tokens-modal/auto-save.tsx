import { FormSpy } from 'react-final-form';

import { Header } from './header';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AutoSave = (props: any) => (
  <FormSpy {...props} debounce={200} subscription={{ values: true }} component={Header} />
);
