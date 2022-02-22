import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import StakingList from './_stakingList';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'stake']))
  }
});

// eslint-disable-next-line import/no-default-export
export default StakingList;
