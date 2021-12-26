import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { RootStore } from 'altamoon-types';
import useChange, { useSet, useValue } from 'use-change';
import Moment from 'react-moment';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';

import { createPortal } from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { MIN_MAX } from './store';
import MinMaxSettings from './MinMaxSettings';

interface Props {
  settingsElement: HTMLElement;
  listenSettingsSave: (handler: () => void) => (() => void);
  listenSettingsCancel: (handler: () => void) => (() => void);
}

const MinMax = ({
  settingsElement, listenSettingsSave, listenSettingsCancel,
}: Props): ReactElement => {
  const setSymbol = useSet(({ persistent }: RootStore) => persistent, 'symbol');
  const minMax = useValue(MIN_MAX, 'minMax');
  const [minMaxTop, setMinMaxTop] = useChange(MIN_MAX, 'minMaxTop');
  const [settingsMinMaxTop, setSettingsMinMaxTop] = useState<number>(minMaxTop);
  const [soundsOn, setSoundsOn] = useChange(MIN_MAX, 'minMaxSoundsOn');
  const [settingsSoundsOn, setSettingsSoundsOn] = useState<boolean>(soundsOn);

  // update pnlType after settings save
  useEffect(
    () => listenSettingsSave(() => {
      setSoundsOn(settingsSoundsOn);
      setMinMaxTop(settingsMinMaxTop);
    }),
    [listenSettingsSave, setMinMaxTop, setSoundsOn, settingsMinMaxTop, settingsSoundsOn],
  );

  // reset pnlType setting after settings change cancel
  useEffect(
    () => listenSettingsCancel(() => {
      setSettingsMinMaxTop(minMaxTop);
      setSettingsSoundsOn(soundsOn);
    }),
    [listenSettingsCancel, minMaxTop, soundsOn],
  );

  return (
    <>
      {createPortal((
        <MinMaxSettings
          soundsOn={settingsSoundsOn}
          setSoundsOn={setSettingsSoundsOn}
          minMaxTop={settingsMinMaxTop}
          setMinMaxTop={setSettingsMinMaxTop}
        />
      ), settingsElement)}
      {!minMax.length && <em>No min/max signals yet</em>}
      <ul style={{ listStyle: 'none' }} className="p-0">
        {minMax.map(({
          symbol, timeISO, type, price,
        }) => (
          <li key={symbol}>
            {type === 'MAX' && <ArrowUp className="text-success" />}

            {type === 'MIN' && <ArrowDown className="text-danger" />}
            {' '}
            <span
              role="button"
              tabIndex={0}
              className="link-alike"
              onClick={() => setSymbol(symbol)}
              onKeyDown={() => setSymbol(symbol)}
            >
              {symbol}
            </span>
            {' '}
            at
            {' '}
            {price}
            {' '}
            <Moment fromNow>{timeISO}</Moment>
          </li>
        ))}
      </ul>
    </>
  );
};

export default hot(MinMax);
