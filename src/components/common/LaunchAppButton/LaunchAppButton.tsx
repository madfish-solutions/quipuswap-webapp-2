import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Button } from '@components/ui/Button';

type LaunchAppButtonProps = {
  className?: string
};

export const LaunchAppButton: React.FC<LaunchAppButtonProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Link href="/">
      <a className={className}>
        <Button>
          {t('common:Launch App')}
        </Button>

      </a>

    </Link>
  );
};
