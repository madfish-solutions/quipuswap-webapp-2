import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import s from './Footer.module.sass';

type FooterProps = {
  classNames?: string
};

export const Footer:React.FC<FooterProps> = ({
  classNames,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <footer className={cx(s.root, classNames)}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('common:Powered by')}
        {' '}
        {t('common:Madfish ❤️')}
      </a>
    </footer>
  );
};
