import { FormSpy } from 'react-final-form';

import { StakeFormInternal } from '@containers/stake/item/components/staking-form/stake-form/stake-form-internal';

// eslint-disable-next-line
export const StakeFormSpy = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={StakeFormInternal} />
);
