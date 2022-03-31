import { FC } from 'react';

import { Card, CardContent } from '@shared/components/card';

import { EnTermsOfService } from './content/en-terms-of-service';
import styles from './terms.module.scss';

export const TermsOfService: FC = () => (
  <Card>
    <CardContent className={styles.content}>
      <EnTermsOfService />
    </CardContent>
  </Card>
);
