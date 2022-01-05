import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Home from './home';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'home']))
  }
});

// eslint-disable-next-line import/no-default-export
export default Home;
