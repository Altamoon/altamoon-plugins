import React, { memo, ReactElement } from 'react';
import * as t from 'biduul-types';
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

const TakeProfit = ({
  isDefault, isEnabled, item, position, onItemChange, onChangeEnabled,
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
        Close if PNL ≥
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          isPnlPercent
          position={position}
          value={takeProfitPercentTrigger}
          onChange={setTakeProfitPercentTrigger}
        />
        % and remains for
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
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
