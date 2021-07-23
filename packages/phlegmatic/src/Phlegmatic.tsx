import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { createPortal } from 'react-dom';
import useChange, { useSet, useSilent, useValue } from 'use-change';
import { Table } from 'reactstrap';
import { hot } from 'react-hot-loader/root';

import PhlegmaticItem from './PhlegmaticItem';
import { PnlPercentType } from './types';
import Settings from './Settings';
import { PHLEGMATIC, TRADING } from './lib/storeSelectors';

interface Props {
  settingsElement: HTMLElement;
  listenSettingsSave: (handler: () => void) => (() => void);
  listenSettingsCancel: (handler: () => void) => (() => void);
  listenIsWidgetEnabled: (handler: (isEnabled: boolean) => void) => (() => void);
  listenWidgetDestroy: (handler: () => void) => (() => void);
}

const Phlegmatic = ({
  settingsElement, listenSettingsSave, listenSettingsCancel,
  listenIsWidgetEnabled, listenWidgetDestroy,
}: Props): ReactElement => {
  const openPositions = useValue(TRADING, 'openPositions');
  const [phlegmaticMap, setPhlegmaticMap] = useChange(PHLEGMATIC, 'phlegmaticMap');
  const defaults = useSilent(PHLEGMATIC, 'defaults');
  const destroy = useSilent(PHLEGMATIC, 'destroy');
  const setIsWidgetEnabled = useSet(PHLEGMATIC, 'isWidgetEnabled');
  const preservePhlegmaticMap = useCallback(
    () => setPhlegmaticMap((map) => ({ ...map })), [setPhlegmaticMap],
  );

  const [pnlType, setPnlType] = useChange(PHLEGMATIC, 'pnlType');
  const [settingsPnlType, setSettingsPnlType] = useState<PnlPercentType>(pnlType);

  // update pnlType after settings save
  useEffect(() => listenSettingsSave(() => { setPnlType(settingsPnlType); }));

  // reset pnlType setting after settings change cancel
  useEffect(() => listenSettingsCancel(() => { setSettingsPnlType(pnlType); }));

  // listen if the widget is enabled or disabled
  useEffect(() => listenIsWidgetEnabled(setIsWidgetEnabled));

  // listen plugin disable
  useEffect(() => listenWidgetDestroy(destroy));

  return (
    <>
      {createPortal((
        <Settings pnlType={settingsPnlType} setPnlType={setSettingsPnlType} />
      ), settingsElement)}
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
    </>
  );
};

export default hot(Phlegmatic);
