import { FC } from 'react';

import { Card, CardContent } from '@shared/components/card';

import { EnPrivacyPolicy } from './content/en-privacy-policy';
import styles from './privacy-policy.module.scss';

export const PrivacyPolicyPage: FC = () => (
  <Card>
    <CardContent className={styles.content}>
      <EnPrivacyPolicy />
    </CardContent>
  </Card>
);
