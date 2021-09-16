import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';

import { WhitelistedToken } from '@utils/types';
import { composeValidators, validateMinMax } from '@utils/validators';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { ComplexInput } from '@components/ui/ComplexInput';
import Vote from '@icons/Vote.svg';
import For from '@icons/For.svg';
import ForInactive from '@icons/ForInactive.svg';
import NotFor from '@icons/NotFor.svg';
import NotForInactive from '@icons/NotForInactive.svg';

import { Radio } from '@components/ui/Radio';
import s from './VoteModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type VoteModalProps = {
  onChange: (token: WhitelistedToken) => void
} & ReactModal.Props;

type HeaderProps = {
  debounce:number,
  save:any,
  values:FormValues,
  form:any,
};

type FormValues = {
  balance:string
  voteFor:boolean
  voteAgainst:boolean
};

const Header:React.FC<HeaderProps> = ({
  debounce, save, values, form,
}) => {
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [values]);

  return (
    <div className={s.inputs}>
      <Vote className={s.icon} />
      <div className={s.tac}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Aenean purus posuere dolor posuere. In tortor ac varius amet malesuada tellus.
      </div>
      <Field
        name="balance"
        validate={composeValidators(
          // reqired
          validateMinMax(0, Infinity),
          // validateBalance
        )}
        // parse={(v) => parseDecimals(v, 0, Infinity)}
      >
        {({ input, meta }) => (
          <ComplexInput
            withoutSelect
            balance="10"
            token1={{} as WhitelistedToken}
            id="voteModal-1"
            label="Votes"
            className={cx(s.input, s.mb24)}
            handleBalance={(value) => {
              form.mutators.setValue(
                'balance',
                +value,
              );
            }}
            noDollar
            {...input}
            error={(meta.touched && meta.error) || meta.submitError}
          />
        )}
      </Field>
      <Field
        name="voteFor"
        initialValue="true"
        type="radio"
      >
        {() => (
          <Radio
            onClick={() => {
              form.mutators.setValue(
                'voteAgainst',
                false,
              );
              form.mutators.setValue(
                'voteFor',
                true,
              );
            }}
            active={values.voteFor ?? false}
            label="For"
            icon={values.voteFor ? <For /> : <ForInactive />}
          />
        )}
      </Field>
      <Field
        name="voteAgainst"
        type="radio"
      >
        {() => (
          <Radio
            onClick={() => {
              form.mutators.setValue(
                'voteFor',
                false,
              );
              form.mutators.setValue(
                'voteAgainst',
                true,
              );
            }}
            active={values.voteAgainst ?? false}
            label="Against"
            icon={values.voteAgainst ? <NotFor /> : <NotForInactive />}
            className={s.mtop16}
          />
        )}
      </Field>
    </div>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const VoteModal: React.FC<VoteModalProps> = ({
  onChange,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  const { Form } = withTypes<FormValues>();

  const handleInput = (values:FormValues) => {
    // TODO
    console.log(values);
  };

  return (
    <Form
      initialValues={{
        voteFor: true,
      }}
      onSubmit={(values:FormValues) => {
        // TODO
        console.log(values, 'submit');
      }}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      render={({ form, handleSubmit }) => (
        <Modal
          title={t('common:Vote')}
          header={(
            <AutoSave
              form={form}
              debounce={1000}
              save={handleInput}
            />
          )}
          className={themeClass[colorThemeMode]}
          cardClassName={cx(s.maxHeight)}
          contentClassName={cx(s.content, s.tokenModal)}
          {...props}
        >
          <Button className={s.button} onClick={handleSubmit}>
            Vote
          </Button>
        </Modal>

      )}
    />
  );
};
