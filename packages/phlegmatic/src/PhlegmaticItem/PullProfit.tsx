import React, { memo, ReactElement } from 'react';
import MiniNumberInput from '../lib/MiniNumberInput';
import PhlegmaticSwitch from '../lib/PhlegmaticSwitch';
import useItem from '../lib/useItem';
import { PhlegmaticPosition } from '../types';

interface Props {
  isEnabled: boolean;
  item: PhlegmaticPosition;
  onItemChange?: (item: PhlegmaticPosition, key: string) => void;
  onChangeEnabled: (isEnabled: boolean) => void;
}

const PullProfit = ({
  isEnabled, item, onItemChange, onChangeEnabled,
}: Props): ReactElement => {
  const [pullProfitPercentValue, setPullProfitPercentValue] = useItem(item, 'pullProfitPercentValue', onItemChange);
  const [pullProfitSecondsInterval, setPullProfitSecondsInterval] = useItem(item, 'pullProfitSecondsInterval', onItemChange);
  const [pullProfitPercentTrigger, setPullProfitPercentTrigger] = useItem(item, 'pullProfitPercentTrigger', onItemChange);

  const isValid = pullProfitPercentValue !== null
    && pullProfitPercentTrigger !== null
    && pullProfitSecondsInterval !== null;

  return (
    <tr>
      <td>
        <PhlegmaticSwitch
          label="Pull profit"
          isValid={isValid}
          isChecked={isEnabled}
          onChange={onChangeEnabled}
        />
      </td>
      <td className={!isEnabled ? 'text-muted' : undefined}>
        Pull
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={pullProfitPercentValue}
          onChange={setPullProfitPercentValue}
        />
        % of initial position size every
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={pullProfitSecondsInterval}
          onChange={setPullProfitSecondsInterval}
        />
        {' '}
        seconds when PNL is more than
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={pullProfitPercentTrigger}
          onChange={setPullProfitPercentTrigger}
        />
        %
      </td>
    </tr>
  );
};

export default memo(PullProfit);
