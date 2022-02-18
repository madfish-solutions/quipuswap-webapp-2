import { useContext, useEffect, useMemo } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { BaseLayout } from '@components/common/BaseLayout';
import { StakeItem } from '@containers/stake';
import { useLoadOnMountStakingStore } from '@containers/stake/item/hooks/use-load-on-mount-staking-store';
import { useToasts } from '@hooks/use-toasts';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/PrivacyPolicy.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const StakeItemPage = observer(() => {
  const { t } = useTranslation(['common', 'privacy', 'stake']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { showErrorToast } = useToasts();
  const { makeStakingObservable, listIsLoading, listIsInitialized, listError } =
    useLoadOnMountStakingStore(showErrorToast);
  const loadingFinished = !listIsLoading && listIsInitialized;

  const router = useRouter();

  const stakeId = router.query['id'];
  const stakeObservable = useMemo(
    () => makeStakingObservable(stakeId?.toString() ?? '0'),
    [makeStakingObservable, stakeId]
  );
  const stake = stakeObservable.staking;

  useEffect(() => {
    if (!stake && loadingFinished) {
      router.replace('/404');
    }
  }, [stake, router, loadingFinished]);

  return (
    <BaseLayout
      title={t(`privacy|Stake - ${SITE_TITLE}`)}
      description={t(`privacy|${SITE_DESCRIPTION}`)}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <StakeItem data={stake ?? null} isError={Boolean(listError)} />
    </BaseLayout>
  );
});
// eslint-disable-next-line import/no-default-export
export default StakeItemPage;

// @ts-ignore
export const getServerSideProps = async props => {
  const { locale } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'privacy', 'stake']))
    }
  };
};
