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
  const [recoverBalancePercentAdd, setRecoverBalancePercentAdd] = useItem(item, 'recoverBalancePercentAdd', onItemChange);
  const [recoverPercentTrigger, setRecoverPercentTrigger] = useItem(item, 'recoverPercentTrigger', onItemChange);
  const [recoverBalancePercentStop, setRecoverBalancePercentStop] = useItem(item, 'recoverBalancePercentStop', onItemChange);

  const isValid = recoverBalancePercentAdd !== null
    && recoverPercentTrigger !== null
    && recoverBalancePercentStop !== null;

  return (
    <tr>
      <td>
        <PhlegmaticSwitch
          label="Recover"
          isValid={isValid}
          isChecked={isEnabled}
          onChange={onChangeEnabled}
        />
      </td>
      <td className={!isEnabled ? 'text-muted' : undefined}>
        Add
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          value={recoverBalancePercentAdd}
          onChange={setRecoverBalancePercentAdd}
        />
        % of bal
        {' '}
        if PNL ≤
        {' '}
        -
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          isPnlPercent
          isNegative
          position={position}
          value={recoverPercentTrigger}
          onChange={setRecoverPercentTrigger}
        />
        % and pos is &lt;
        {' '}
        <MiniNumberInput
          isDefault={isDefault}
          isEnabled={isEnabled}
          value={recoverBalancePercentStop}
          onChange={setRecoverBalancePercentStop}
        />
        % of bal
      </td>
    </tr>
  );
};

export default memo(TakeProfit);
