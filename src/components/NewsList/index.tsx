import React from 'react';
import styles from './index.less';

const NumberCount: React.FunctionComponent = () => {
  return (
    <>
      <ul className={styles.news}>
        <li>
          <h3>配置L4级自动驾驶技术，扫地机器人：1台=6个环卫工人</h3>
          2019-08-14 18:02:15
          <article>
            今年暑假，不少前往三亚的游客发现，海南呀诺达热带雨林风景区内出现了一个特殊的“环卫工人”...
          </article>
        </li>
        <li>
          <h3>配置L4级自动驾驶技术，扫地机器人：1台=6个环卫工人</h3>
          2019-08-14 18:02:15
          <article>
            今年暑假，不少前往三亚的游客发现，海南呀诺达热带雨林风景区内出现了一个特殊的“环卫工人”...
          </article>
        </li>
      </ul>
    </>
  );
};

export default NumberCount;
