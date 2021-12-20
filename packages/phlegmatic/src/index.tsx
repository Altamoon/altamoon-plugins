import React from 'react';
import { Provider as UseChangeProvider } from 'use-change';

import { render } from 'react-dom';
import Phlegmatic from './Phlegmatic';
import { RootStore } from './types';
import PhlegmaticStore from './PhlegmaticStore';

window.altamoonPlugin<RootStore>((store) => {
  const { currentScript } = document;
  if (!currentScript) throw new Error('Unable to detect currentScript');
  const {
    isWidgetInitiallyEnabled, settingsElement, element,
    listenSettingsSave, listenSettingsCancel, listenIsWidgetEnabled, listenWidgetDestroy,
  } = store.customization.createWidget({
    id: 'phlegmatic',
    title: 'Phlegmatic',
    currentScript,
    hasSettings: true,
    layout: { h: 20, w: 30, minH: 5 },
  });

  // eslint-disable-next-line no-param-reassign
  store.phlegmatic = new PhlegmaticStore(store, isWidgetInitiallyEnabled);

  if (!settingsElement) throw new Error('Settings element is missing even though "hasSettings" is "true"');

  render((
    <UseChangeProvider value={store}>
      <Phlegmatic
        settingsElement={settingsElement}
        listenSettingsSave={listenSettingsSave}
        listenSettingsCancel={listenSettingsCancel}
        listenIsWidgetEnabled={listenIsWidgetEnabled}
        listenWidgetDestroy={listenWidgetDestroy}
      />
    </UseChangeProvider>
  ), element);
});
