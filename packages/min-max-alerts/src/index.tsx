import * as t from 'altamoon-types';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'use-change';
import MinMax from './MinMax';
import MinMaxStore from './store';

window.altamoonPlugin((store: t.RootStore & { minMax: MinMaxStore }) => {
  const { currentScript } = document;
  if (!currentScript) throw new Error('Unable to detect currentScript');

  const minMaxWidget = store.customization.createWidget({
    id: 'altamoon_min_max_alerts',
    hasSettings: true,
    title: 'Min/Max 24h alerts',
    currentScript,
    layout: { h: 30, w: 40 },
  });

  if (!minMaxWidget.settingsElement) throw new Error('Settings element is missing even though "hasSettings" is "true"');

  // eslint-disable-next-line no-param-reassign
  store.minMax = new MinMaxStore();

  render((
    <Provider value={store}>
      <MinMax
        settingsElement={minMaxWidget.settingsElement}
        listenSettingsSave={minMaxWidget.listenSettingsSave}
        listenSettingsCancel={minMaxWidget.listenSettingsCancel}
      />
    </Provider>
  ), minMaxWidget.element);
});
