import { FC } from 'react';

import { FileName, useTranslation } from '@translation';

interface Props {
  ns: FileName;
}

export const Trans: FC<Props> = ({ ns, children }) => {
  const { t } = useTranslation();

  return <>{t(`${ns}|${children}`)}</>;
};
