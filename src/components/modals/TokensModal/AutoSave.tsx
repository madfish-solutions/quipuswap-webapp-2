import React from 'react';

import { FormSpy } from 'react-final-form';

import { Header } from '@components/modals/TokensModal/Header';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AutoSave = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={Header} />;
