import React, { useRef, useState } from 'react';

import { Button, Copy } from '@quipuswap/ui-kit';
import { noop } from 'rxjs';

import { CheckMark } from '@components/svg/CheckMark';
import { shortize } from '@utils/helpers';

import styles from './contract-hash-with-copy.module.sass';

interface ContractHashProps {
  contractAddress: string;
}

export const ContractHashWithCopy: React.FC<ContractHashProps> = ({ contractAddress }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const timeout = useRef(setTimeout(noop, 0));

  const handleCopy = async () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
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
