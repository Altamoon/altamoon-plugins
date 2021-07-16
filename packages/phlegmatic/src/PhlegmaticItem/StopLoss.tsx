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

const StopLoss = ({
  isEnabled, item, onItemChange, onChangeEnabled,
}: Props): ReactElement => {
  const [stopLossPercentTrigger, setStopLossPercentTrigger] = useItem(item, 'stopLossPercentTrigger', onItemChange);
  const [stopLossSecondsShouldRemain, setStopLossSecondsShouldRemain] = useItem(item, 'stopLossSecondsShouldRemain', onItemChange);

  const isValid = stopLossPercentTrigger !== null
    && stopLossSecondsShouldRemain !== null;

  return (
    <tr>
      <td>
        <PhlegmaticSwitch
          label="Stop loss"
          isValid={isValid}
          isChecked={isEnabled}
          onChange={onChangeEnabled}
        />
      </td>
      <td className={!isEnabled ? 'text-muted' : undefined}>
        Stop loss when PNL reaches
        {' '}
        &minus;
        <MiniNumberInput
          isEnabled={isEnabled}
          value={stopLossPercentTrigger}
          onChange={setStopLossPercentTrigger}
        />
        % and remains below for
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={stopLossSecondsShouldRemain}
          onChange={setStopLossSecondsShouldRemain}
        />
        {' '}
        seconds
      </td>
    </tr>
  );
};

export default memo(StopLoss);
