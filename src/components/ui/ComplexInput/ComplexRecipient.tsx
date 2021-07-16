import React, { useContext, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import TextareaAutosize from 'react-textarea-autosize';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';

import s from './ComplexInput.module.sass';

type ComplexRecipientProps = {
  className?: string,
  label?:string,
  error?: string
  handleInput: (value: string) => void
} & React.HTMLProps<HTMLTextAreaElement>;

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const compoundClassName = cx(
    { [s.focused]: focused },
    modeClass[colorThemeMode],
    { [s.error]: !readOnly && !!error },
    { [s.readOnly]: readOnly },
    className,
  );

  const focusInput = () => {
    if (inputRef?.current && !readOnly) {
      inputRef.current.focus();
    }
  };

  const handlePaste = async () => handleInput(await navigator.clipboard.readText());

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
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            className={cx(s.recipient, s.item1, s.input)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            readOnly={readOnly}
            // @ts-ignore
            ref={inputRef}
            {...props}
          />
        </div>
      </div>
      <div className={s.controls}>
        <Button
          disabled={readOnly}
          onClick={handlePaste}
          theme="inverse"
          className={s.btn}
        >
          {t('swap:Paste')}
        </Button>
      </div>
      {!readOnly && (<ComplexError error={error} />)}
    </div>
  );
};
