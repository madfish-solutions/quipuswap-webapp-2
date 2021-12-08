import React, { useContext, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useTranslation } from 'next-i18next';
import { Button, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import useUpdateToast from '@hooks/useUpdateToast';
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

  const updateToast = useUpdateToast();

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

  const handlePaste = async () => {
    try {
      handleInput(
        await navigator.clipboard.readText(),
      );
    } catch (err) {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    }
  };

  return (
    <div className={compoundClassName} onClick={focusInput} onKeyPress={focusInput} role="button" tabIndex={0}>
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
            className={cx(s.recipient, s.item1, s.unitem1, s.input)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            readOnly={readOnly}
            // @ts-ignore
            ref={inputRef}
            {...props}
          />
        </div>
      </div>
      {'readText' in navigator.clipboard && (
        <div className={s.controls}>
          <Button
            disabled={readOnly}
            onClick={handlePaste}
            theme="inverse"
            className={s.btn}
          >
            {t('common|Paste')}
          </Button>
        </div>
      )}
      {!readOnly && (<ComplexError error={error} />)}
    </div>
  );
};
