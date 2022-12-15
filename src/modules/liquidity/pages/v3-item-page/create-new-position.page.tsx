import { observer } from 'mobx-react-lite';

import { StickyBlock, TestnetAlert } from '@shared/components';

import { OpenNewPositionForm, PageTitleContainer, PoolDetails, PositionFormCard } from './components';
import { useCreateNewPositionPageViewModel } from './use-create-new-position-page.vm';

export const CreateNewPositionPage = observer(() => {
  const { titleText, backHref, ...formProps } = useCreateNewPositionPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitleContainer dataTestId="v3LiqCreatePosition" titleText={titleText} />
      <StickyBlock>
        <PositionFormCard backHref={backHref}>
          <OpenNewPositionForm {...formProps} />
        </PositionFormCard>
        <PoolDetails />
      </StickyBlock>
    </>
  );
});
