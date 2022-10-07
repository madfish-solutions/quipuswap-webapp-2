import { FC } from 'react';

import cx from 'classnames';
import { Field, FormSpy } from 'react-final-form';

import { DEBOUNCE_MS, MOCK_LOADING_ARRAY } from '@config/constants';
import { ColorModes } from '@providers/color-theme-context';
import { Button, LoadingTokenCell } from '@shared/components';
import { getTokenSlug, isTokenEqual } from '@shared/helpers';
import { NotFound, Plus } from '@shared/svg';

import { Modal } from '../modal';
import { Header } from './PositionModalHeader';
import s from './PositionsModal.module.scss';
import { IPositionsModalProps, PMFormField } from './PositionsModal.types';
import { PositionTokenCell } from './PositionTokenCell';
import { usePositionsModalViewModel } from './use-positions-modal.vm';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

// eslint-disable-next-line
const AutoSave = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={Header} />;

export const PositionsModal: FC<IPositionsModalProps> = props => {
  const {
    allTokens,
    colorThemeMode,
    handleInput,
    handleSelect,
    handleTokenA,
    handleTokenB,
    handleTokenListItem,
    initialPair,
    isSelectDisabled,
    isSoleFa2Token,
    isTokensLoading,
    isTokensNotFound,
    notSelectable1,
    notSelectable2,
    onRequestClose,
    shouldSubmitOnRequest,
    t,
    Form
  } = usePositionsModalViewModel(props);

  return (
    <Form
      onSubmit={handleInput}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        }
      }}
      initialValues={{
        [PMFormField.FIRST_TOKEN]: initialPair?.token1,
        [PMFormField.SECOND_TOKEN]: initialPair?.token2
      }}
      render={
        //eslint-disable-next-line sonarjs/cognitive-complexity
        ({ form, values }) => (
          <Modal
            title={t('common|Your Positions')}
            header={<AutoSave form={form} debounce={DEBOUNCE_MS} save={handleInput} isSecondInput={isSoleFa2Token} />}
            footer={
              <Button
                onClick={() => handleSelect(values)}
                disabled={isSelectDisabled(values)}
                className={s.modalButton}
                theme="primary"
                data-test-id="buttonSelect"
              >
                Select
              </Button>
            }
            className={themeClass[colorThemeMode]}
            modalClassName={s.tokenModal}
            containerClassName={s.tokenModal}
            cardClassName={cx(s.tokenModal, s.maxHeight)}
            contentClassName={cx(s.tokenModal)}
            onRequestClose={e => {
              if (shouldSubmitOnRequest(values)) {
                handleSelect(values);
              }
              if (onRequestClose) {
                onRequestClose(e);
              }
            }}
            data-test-id="modalYourPositions"
            {...props}
          >
            <Field name={PMFormField.FIRST_TOKEN} initialValue={notSelectable1}>
              {({ input }) => {
                const token = input.value;
                if (!token) {
                  return '';
                }

                return <PositionTokenCell token={token} onClick={() => handleTokenA(token, form, values)} isChecked />;
              }}
            </Field>
            {values[PMFormField.FIRST_TOKEN] && (
              <div className={s.listItem}>
                <Plus className={s.iconButton} />
                <div className={s.listText}>Search another Token</div>
              </div>
            )}
            <Field name={PMFormField.SECOND_TOKEN} initialValue={notSelectable2}>
              {({ input }) => {
                const token = input.value;
                if (!token) {
                  return '';
                }

                return <PositionTokenCell token={token} onClick={() => handleTokenB(token, form, values)} isChecked />;
              }}
            </Field>
            {isTokensNotFound && (
              <div className={s.tokenNotFound}>
                <NotFound />
                <div className={s.notFoundLabel}>{t('common|No tokens found')}</div>
              </div>
            )}
            {isTokensLoading && MOCK_LOADING_ARRAY.map(x => <LoadingTokenCell key={x} />)}
            {!values[PMFormField.SECOND_TOKEN] &&
              allTokens
                .filter(
                  token => !values[PMFormField.FIRST_TOKEN] || !isTokenEqual(token, values[PMFormField.FIRST_TOKEN])
                )
                .map(token => (
                  <PositionTokenCell
                    key={getTokenSlug(token)}
                    token={token}
                    onClick={() => handleTokenListItem(token, form, values)}
                    isChecked={false}
                  />
                ))}
          </Modal>
        )
      }
    />
  );
};
