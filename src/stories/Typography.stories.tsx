import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Typography } from './Typography';

// eslint-disable-next-line
export default {
  title: 'UI/Typography',
  component: Typography,
  parameters: {
    // layout: 'fullscreen'
  }
} as ComponentMeta<typeof Typography>;

export const Template: ComponentStory<typeof Typography> = args => <Typography {...args} />;

// export const Primary = Template.bind({ label: 'Primary' });
