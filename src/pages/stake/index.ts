import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Stake } from './_stake';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'stake']))
  }
});

// eslint-disable-next-line import/no-default-export
export default Stake;
