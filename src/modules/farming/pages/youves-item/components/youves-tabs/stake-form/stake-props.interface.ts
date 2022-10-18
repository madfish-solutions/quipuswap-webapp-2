import { TabProps } from '../tab-props.interface';

export interface StakeProps extends TabProps {
  inputAmount: string;
  handleSubmit: () => void;
  handleInputAmountChange: (value: string) => void;
  disabled: boolean;
  isSubmitting: boolean;
  inputAmountError?: string;
}
