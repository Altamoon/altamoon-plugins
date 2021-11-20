import * as t from 'altamoon-types';
import React from 'react';

import { render } from 'react-dom';
import HelloWorld from './HelloWorld';

window.altamoonPlugin((store: t.RootStore) => {
  const { currentScript } = document;
  if (!currentScript) throw new Error('Unable to detect currentScript');
  const {
    element, settingsElement, listenSettingsSave, listenSettingsCancel,
  } = store.customization.createWidget({
    id: 'hello_world_react',
    hasSettings: true,
    title: 'Hello World React',
    currentScript,
    layout: { h: 6, w: 4, minH: 5 },
  });

  const createOrder = async (side: 'BUY' | 'SELL', quantity: number) => {
    await store.trading.marketOrder({
      quantity, side, symbol: store.persistent.symbol,
    });
  };

  if (!settingsElement) throw new Error('Settings element is missing even though "hasSettings" is "true"');

  render((
    <HelloWorld
      settingsElement={settingsElement}
      createOrder={createOrder}
      listenSettingsSave={listenSettingsSave}
      listenSettingsCancel={listenSettingsCancel}
    />
  ), element);
});
