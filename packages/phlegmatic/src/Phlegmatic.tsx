import React, {
  ReactElement, useCallback, useEffect,
} from 'react';
import useChange, { useSet, useSilent, useValue } from 'use-change';
import { Table } from 'reactstrap';
import { hot } from 'react-hot-loader/root';

import PhlegmaticItem from './PhlegmaticItem';
import { PHLEGMATIC, TRADING } from './lib/storeSelectors';

interface Props {
  listenIsWidgetEnabled: (handler: (isEnabled: boolean) => void) => (() => void);
  listenWidgetDestroy: (handler: () => void) => (() => void);
}

const Phlegmatic = ({ listenIsWidgetEnabled, listenWidgetDestroy }: Props): ReactElement => {
  const openPositions = useValue(TRADING, 'openPositions');
  const [phlegmaticMap, setPhlegmaticMap] = useChange(PHLEGMATIC, 'phlegmaticMap');
  const defaults = useSilent(PHLEGMATIC, 'defaults');
  const destroy = useSilent(PHLEGMATIC, 'destroy');
  const setIsWidgetEnabled = useSet(PHLEGMATIC, 'isWidgetEnabled');
  const preservePhlegmaticMap = useCallback(
    () => setPhlegmaticMap((map) => ({ ...map })), [setPhlegmaticMap],
  );

  // listen if the widget is enabled or disabled
  useEffect(() => listenIsWidgetEnabled(setIsWidgetEnabled));

  // listen plugin disable
  useEffect(() => listenWidgetDestroy(destroy));

  return (
    <div className="row">
      <div className="col-12 mb-1">
        <Table>
          <colgroup>
            <col />
            <col width={200} />
          </colgroup>
          <PhlegmaticItem isDefault item={defaults} />
          {openPositions.map((position) => !!phlegmaticMap[position.symbol] && (
            <PhlegmaticItem
              key={position.symbol}
              isDefault={false}
              position={position}
              item={phlegmaticMap[position.symbol]}
              // trigger save
              onItemChange={preservePhlegmaticMap}
            />
          ))}
        </Table>
      </div>
    </div>
  );
};

export default hot(Phlegmatic);
