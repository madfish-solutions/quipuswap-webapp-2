import { Meta, Story } from '@storybook/react';

import { ButtonUI } from '@shared/components/button/button-ui';

// eslint-disable-next-line
export default {
  title: 'UI/ButtonUI',
  component: ButtonUI
} as Meta;

export const Base: Story = () => <ButtonUI label="Button content" />;
