import React from 'react';
import styles from './index.less';
interface NumberCountProps {
  text: string;
  number: number;
}

const NumberCount: React.FunctionComponent<NumberCountProps> = ({ text, number }) => {
  return (
    <>
      <div className={styles.count}>
        <h1>
          {number}
          <i>个</i>
        </h1>
        {text}
      </div>
    </>
  );
};

export default NumberCount;
