import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Button } from '@components/ui/Button';

type OldVersionButtonProps = {
  className?: string
};

export const OldVersionButton: React.FC<OldVersionButtonProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Link
      href="https://quipuswap.com/"
    >
      <a
        target="_blank"
        rel="noreferrer noopener"
      >
        <Button theme="secondary" className={className}>
          {t('common:Old version')}

        </Button>
      </a>
    </Link>
  );
};
