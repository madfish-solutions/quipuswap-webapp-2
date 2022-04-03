import { FC, useRef, useState } from 'react';

import { noop } from 'rxjs';

import { shortize } from '@shared/helpers';
import { CheckMark, Copy } from '@shared/svg';

import { Button } from '../button';
import styles from './contract-hash-with-copy.module.scss';

interface Props {
  contractAddress: string;
}

const TIMEOUT_MILLISECONDS = 2000;

export const ContractHashWithCopy: FC<Props> = ({ contractAddress }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const timeout = useRef(setTimeout(noop, 0));

  const handleCopy = async () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, TIMEOUT_MILLISECONDS);
  };

  return (
    <span className={styles.root}>
      <Button onClick={handleCopy} theme="underlined" className={styles.button}>
        {shortize(contractAddress)}
      </Button>
      <Button
        onClick={handleCopy}
        theme="inverse"
        control={copied ? <CheckMark className={styles.icon} /> : <Copy className={styles.icon} />}
      />
    </span>
  );
};
