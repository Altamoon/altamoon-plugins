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

const PullProfit = ({
  isDefault, isEnabled, item, position, onItemChange, onChangeEnabled,
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
          isDefault={isDefault}
          isEnabled={isEnabled}
          position={position}
          value={pullProfitPercentValue}
          onChange={setPullProfitPercentValue}
        />
        % every
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          value={pullProfitSecondsInterval}
          onChange={setPullProfitSecondsInterval}
        />
        {' '}
        sec when PNL ≥
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          isPnlPercent
          position={position}
          value={pullProfitPercentTrigger}
          onChange={setPullProfitPercentTrigger}
        />
        %
      </td>
    </tr>
  );
};

export default memo(PullProfit);
