import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@config/config';
import { Slippage, StateCurrencyAmount, Tooltip } from '@shared/components';
import { getMinimalOutput, getTokenSymbol } from '@shared/helpers';
import { useTranslation } from '@shared/hooks';
import { Nullable, Token } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

interface Props {
  error?: string;
  loading: boolean;
  outputAmount?: BigNumber;
  outputToken?: Token;
  slippage?: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

export const SwapSlippage: FC<Props> = ({ error, outputAmount, onChange, slippage, outputToken, loading }) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ? newValue : DEFAULT_SLIPPAGE_PERCENTAGE));

  const minimumReceived = getMinimalOutput(outputAmount, slippage, outputToken?.metadata.decimals ?? 0);

  return (
    <>
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{t('common|Slippage')}</span>
        <Tooltip
          content={t(
            'common|Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through.'
          )}
        />
      </label>
      <Slippage handleChange={handleChange} placeholder={slippage?.toFixed()} />
      {error && <div className={styles.simpleError}>{error}</div>}
      <div className={styles.receive}>
        {slippage && (
          <>
            <span className={styles.receiveLabel}>Minimum received:</span>
            <StateCurrencyAmount
              amount={minimumReceived}
              isError={!minimumReceived && !loading}
              currency={outputToken ? getTokenSymbol(outputToken) : ''}
            />
          </>
        )}
      </div>
    </>
  );
};
