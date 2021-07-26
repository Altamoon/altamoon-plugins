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

const ReduceLoss = ({
  isDefault, isEnabled, item, position, onItemChange, onChangeEnabled,
}: Props): ReactElement => {
  const [reduceLossPercentValue, setReduceLossPercentValue] = useItem(item, 'reduceLossPercentValue', onItemChange);
  const [reduceLossPercentTrigger, setReduceLossPercentTrigger] = useItem(item, 'reduceLossPercentTrigger', onItemChange);
  const [reduceLossSecondsInterval, setReduceLossSecondsInterval] = useItem(item, 'reduceLossSecondsInterval', onItemChange);

  const isValid = reduceLossPercentValue !== null
    && reduceLossPercentTrigger !== null
    && reduceLossSecondsInterval !== null;

  return (
    <tr>
      <td>
        <PhlegmaticSwitch
          label="Reduce loss"
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
          value={reduceLossPercentValue}
          onChange={setReduceLossPercentValue}
        />
        % every
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          value={reduceLossSecondsInterval}
          onChange={setReduceLossSecondsInterval}
        />
        {' '}
        sec when PNL ≤
        {' '}
        &minus;
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          isPnlPercent
          isNegative
          position={position}
          value={reduceLossPercentTrigger}
          onChange={setReduceLossPercentTrigger}
        />
        %
      </td>
    </tr>
  );
};

export default memo(ReduceLoss);
