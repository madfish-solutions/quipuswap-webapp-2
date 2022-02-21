import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import StakingList from './_staking';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'stake']))
  }
});

// eslint-disable-next-line import/no-default-export
export default StakingList;
