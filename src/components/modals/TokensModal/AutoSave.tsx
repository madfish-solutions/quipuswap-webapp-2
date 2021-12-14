import React from 'react';

import { FormSpy } from 'react-final-form';

import { Header } from '@components/modals/TokensModal/Header';

export const AutoSave = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={Header} />;
