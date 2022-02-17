import { FC, useEffect, useState } from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { mockStakings, StakeItem } from '@containers/stake';
import { StakeListItemProps } from '@containers/stake/list/structures';
import { useToasts } from '@hooks/use-toasts';
import NotFound from 'pages/404';

interface MockLoadingState {
  loading: true;
  error: null;
  data: null;
}

interface MockErrorState {
  loading: false;
  error: Error;
  data: null;
}

interface MockReadyState {
  loading: false;
  error: null;
  data: StakeListItemProps;
}

type MockState = MockLoadingState | MockErrorState | MockReadyState;

const StakeItemPage: FC = () => {
  const { showErrorToast } = useToasts();

  const [mockState, setMockState] = useState<MockState>({ loading: true, error: null, data: null });
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMockState({ loading: false, error: null, data: mockStakings[0] });
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (mockState.error) {
      showErrorToast(mockState.error);
    }
  }, [mockState.error, showErrorToast]);

  if (mockState.error) {
    return <NotFound />;
  }

  return <StakeItem data={mockState.data} />;
};
// eslint-disable-next-line import/no-default-export
export default StakeItemPage;

// @ts-ignore
export const getServerSideProps = async props => {
  const { locale } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'stake']))
    }
  };
};
