import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FarmingList from './_farmingList';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'stake']))
  }
});

// eslint-disable-next-line import/no-default-export
export default FarmingList;
