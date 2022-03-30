import { FC } from 'react';

import { Card, CardContent } from '@shared/components/card';

import { EnPrivacyPolicy } from './content/en-privacy-policy';
import styles from './privacy-policy.module.scss';

export const PrivacyPolicy: FC = () => (
  <Card>
    <CardContent className={styles.content}>
      <EnPrivacyPolicy />
    </CardContent>
  </Card>
);
