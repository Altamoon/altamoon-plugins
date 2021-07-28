import React from 'react';
import { Provider as UseChangeProvider } from 'use-change';

import { render } from 'react-dom';
import Phlegmatic from './Phlegmatic';
import { RootStore } from './types';
import PhlegmaticStore from './PhlegmaticStore';

window.biduulPlugin<RootStore>((store) => {
  const { currentScript } = document;
  if (!currentScript) throw new Error('Unable to detect currentScript');
  const {
    isWidgetInitiallyEnabled, element, listenIsWidgetEnabled, listenWidgetDestroy,
  } = store.customization.createWidget({
    id: 'phlegmatic',
    title: 'Phlegmatic',
    currentScript,
    hasSettings: false,
    layout: { h: 6, w: 4, minH: 5 },
  });

  // eslint-disable-next-line no-param-reassign
  store.phlegmatic = new PhlegmaticStore(store, isWidgetInitiallyEnabled);

  render((
    <UseChangeProvider value={store}>
      <Phlegmatic
        listenIsWidgetEnabled={listenIsWidgetEnabled}
        listenWidgetDestroy={listenWidgetDestroy}
      />
    </UseChangeProvider>
  ), element);
});
