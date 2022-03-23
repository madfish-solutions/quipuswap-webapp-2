import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FarmsList from './_farmsList';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'farm']))
  }
});

// eslint-disable-next-line import/no-default-export
export default FarmsList;
