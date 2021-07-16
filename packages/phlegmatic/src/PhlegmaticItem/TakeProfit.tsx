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

const TakeProfit = ({
  isEnabled, item, onItemChange, onChangeEnabled,
}: Props): ReactElement => {
  const [takeProfitPercentTrigger, setTakeProfitPercentTrigger] = useItem(item, 'takeProfitPercentTrigger', onItemChange);
  const [takeProfitSecondsShouldRemain, setTakeProfitSecondsShouldRemain] = useItem(item, 'takeProfitSecondsShouldRemain', onItemChange);

  const isValid = takeProfitPercentTrigger !== null
    && takeProfitSecondsShouldRemain !== null;

  return (
    <tr>
      <td>
        <PhlegmaticSwitch
          label="Take profit"
          isValid={isValid}
          isChecked={isEnabled}
          onChange={onChangeEnabled}
        />
      </td>
      <td className={!isEnabled ? 'text-muted' : undefined}>
        Take remaining profit when PNL reaches
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={takeProfitPercentTrigger}
          onChange={setTakeProfitPercentTrigger}
        />
        % and remains above for
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={takeProfitSecondsShouldRemain}
          onChange={setTakeProfitSecondsShouldRemain}
        />
        {' '}
        seconds
      </td>
    </tr>
  );
};

export default memo(TakeProfit);
