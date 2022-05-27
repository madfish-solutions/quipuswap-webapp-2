import { CFC } from '@shared/types';
import { FileName, useTranslation } from '@translation';

interface Props {
  ns: FileName;
}

export const Trans: CFC<Props> = ({ ns, children }) => {
  const { t } = useTranslation();

  //TODO create Key
  //@ts-ignore
  return <>{t(`${ns}|${children}`)}</>;
};
