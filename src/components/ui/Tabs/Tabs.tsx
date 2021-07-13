import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Tabs.module.sass';

type TabsProps = {
  values: {
    id: string
    label: string
  }[]
  activeId: string
  setActiveId: (id: string) => void
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Tabs: React.FC<TabsProps> = ({
  values,
  activeId,
  setActiveId,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    className,
  );

  const buttonsArrayRef = useRef<{ [key: string]: HTMLButtonElement }>({});
  const [stripeState, setStripeState] = useState({
    width: 0,
    transform: 0,
  });

  const addToRefs = (id: string, element: HTMLButtonElement | null) => {
    if (element) {
      buttonsArrayRef.current[id] = element;
    }
  };

  useEffect(() => {
    if (buttonsArrayRef?.current) {
      const activeElement = buttonsArrayRef.current[activeId];
      setStripeState({
        width: activeElement.offsetWidth - 16,
        transform: activeElement.offsetLeft + 8,
      });
    }
  }, [activeId, values]);

  return (
    <div className={compoundClassName}>
      {values.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={cx(s.item, { [s.active]: id === activeId })}
          title={label}
          onClick={() => setActiveId(id)}
          ref={(el) => addToRefs(id, el)}
        >
          {label}
        </button>
      ))}
      <span
        className={s.stripe}
        style={{
          width: stripeState.width,
          transform: `translateX(${stripeState.transform}px)`,
        }}
      />
    </div>
  );
};
