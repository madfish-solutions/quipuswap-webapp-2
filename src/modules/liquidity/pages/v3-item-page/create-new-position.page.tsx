import { observer } from 'mobx-react-lite';

import { StickyBlock, TestnetAlert } from '@shared/components';

import { OpenNewPositionForm, PageTitleContainer, PoolDetailsCreate, PositionFormCard } from './components';
import { useCreateNewPositionPageViewModel } from './use-create-new-position-page.vm';

export const CreateNewPositionPage = observer(() => {
  const { titleText, backHref, isBlocked, ...formProps } = useCreateNewPositionPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitleContainer dataTestId="v3LiqCreatePosition" titleText={titleText} />
      <StickyBlock>
        <PositionFormCard backHref={backHref}>
          {isBlocked ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: '88px',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'rgba(255, 255, 0, 0.8)',
                paddingLeft: 8
              }}
            >
              <p>The deposits to the pool are paused.</p>
            </div>
          ) : (
            <OpenNewPositionForm {...formProps} />
          )}
        </PositionFormCard>
        <PoolDetailsCreate />
      </StickyBlock>
    </>
  );
});
