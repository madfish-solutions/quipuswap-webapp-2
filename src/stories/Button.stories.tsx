import { Meta, Story } from '@storybook/react';

import { Button } from '@shared/components/button';

// eslint-disable-next-line
export default {
  title: 'UI/Button',
  component: Button
} as Meta;

export const Base: Story = () => <Button />;
