import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Slider } from '@components/ui/slider';
import { TopStats } from '@components/ui/top-stats';

export const ListStats: FC = observer(() => {
  return (
    <div style={{ marginBottom: 32 }}>
      <Slider>
        <TopStats title="a" amount="1" />
        <TopStats title="b" amount="2" />
        <TopStats title="c" amount="3" />
        <TopStats title="d" amount="4" />
      </Slider>
    </div>
  );
});
