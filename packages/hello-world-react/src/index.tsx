import * as t from 'biduul-types';
import React from 'react';

import { render } from 'react-dom';
import HelloWorld from './HelloWorld';

window.biduulPlugin((store: t.RootStore /* , api: Api */) => {
  const {
    element, settingsElement, listenSettingsSave, listenSettingsCancel,
  } = store.customization.createWidget({
    id: 'hello_world_react',
    hasSettings: true,
    title: 'Hello World React',
    currentScript: document.currentScript,
    layout: { h: 6, w: 4, minH: 5 },
  });

  const createOrder = async (side: 'BUY' | 'SELL', quantity: number) => {
    await store.trading.marketOrder({
      quantity, side, symbol: store.persistent.symbol,
    });
  };

  render((
    <HelloWorld
      settingsElement={settingsElement}
      createOrder={createOrder}
      listenSettingsSave={listenSettingsSave}
      listenSettingsCancel={listenSettingsCancel}
    />
  ), element);
});
