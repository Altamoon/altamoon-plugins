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

const ReduceLoss = ({
  isEnabled, item, onItemChange, onChangeEnabled,
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
          isEnabled={isEnabled}
          value={reduceLossPercentValue}
          onChange={setReduceLossPercentValue}
        />
        % of initial position size every
        {' '}
        <MiniNumberInput
          isEnabled={isEnabled}
          value={reduceLossSecondsInterval}
          onChange={setReduceLossSecondsInterval}
        />
        {' '}
        seconds when PNL is less than
        {' '}
        &minus;
        <MiniNumberInput
          isEnabled={isEnabled}
          value={reduceLossPercentTrigger}
          onChange={setReduceLossPercentTrigger}
        />
        %
      </td>
    </tr>
  );
};

export default memo(ReduceLoss);
