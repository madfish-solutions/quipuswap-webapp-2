import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PrivacyPolicy } from './privacy-policy';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'privacy']))
  }
});

// eslint-disable-next-line import/no-default-export
export default PrivacyPolicy;
