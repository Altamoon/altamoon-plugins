import React, { memo, ReactElement } from 'react';
import * as t from 'altamoon-types';
import MiniNumberInput from '../lib/MiniNumberInput';
import PhlegmaticSwitch from '../lib/PhlegmaticSwitch';
import useItem from '../lib/useItem';
import { PhlegmaticPosition } from '../types';

interface Props {
  isDefault: boolean;
  isEnabled: boolean;
  item: PhlegmaticPosition;
  position?: t.TradingPosition;
  onItemChange?: (item: PhlegmaticPosition, key: string) => void;
  onChangeEnabled: (isEnabled: boolean) => void;
}

const StopLoss = ({
  isDefault, isEnabled, item, position, onItemChange, onChangeEnabled,
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
        Close if PNL ≤
        {' '}
        &minus;
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          isPnlPercent
          isNegative
          position={position}
          value={stopLossPercentTrigger}
          onChange={setStopLossPercentTrigger}
        />
        % and remains for
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
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
