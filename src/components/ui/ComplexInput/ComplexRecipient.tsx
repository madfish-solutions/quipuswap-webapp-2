import React, { useContext, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { isTouchDevice } from '@utils/helpers';

import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { Button } from '@components/ui/Button';

import s from './ComplexInput.module.sass';

type ComplexRecipientProps = {
  className?: string,
  label?:string,
  error?: string
  handleInput: (value: string) => void
} & (
  | React.HTMLProps<HTMLTextAreaElement>
  | React.HTMLProps<HTMLInputElement>);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexRecipient: React.FC<ComplexRecipientProps> = ({
  className,
  label,
  id,
  readOnly,
  error,
  handleInput,
  ...props
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [focused, setActive] = React.useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const compoundClassName = cx(
    { [s.focused]: focused },
    modeClass[colorThemeMode],
    { [s.error]: !readOnly && !!error },
    { [s.readOnly]: readOnly },
    s.recipientBase,
    className,
  );

  const focusInput = () => {
    if (inputRef?.current && !readOnly) {
      inputRef.current.focus();
    }
  };

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={compoundClassName}
      onClick={focusInput}
    >
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.background}>

        <div className={s.shape}>
          {isTouchDevice()
            ? (
              <textarea
                className={cx(s.recipient, s.item1, s.input)}
                ref={inputRef as React.Ref<HTMLTextAreaElement>}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                readOnly={readOnly}
                {...props as React.HTMLProps<HTMLTextAreaElement>}
              />
            ) : (
              <input
                className={cx(s.recipient, s.item1, s.input)}
                ref={inputRef as React.Ref<HTMLInputElement>}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                readOnly={readOnly}
                {...props as React.HTMLProps<HTMLInputElement>}
              />
            )}
          <Button
            disabled={readOnly}
            onClick={() => {
              async function paste() {
                handleInput(await navigator.clipboard.readText());
              }
              paste();
            }}
            theme="quaternary"
            className={s.pasteWrap}
          >
            <div className={cx(s.paste)}>
              {t('swap:Paste')}
            </div>
          </Button>
        </div>
      </div>
      {!readOnly && (<ComplexError error={error} />)}
    </div>
  );
};
