import * as t from 'altamoon-types';
import React from 'react';

import { render } from 'react-dom';
import { Provider } from 'use-change';
import WhaleCalculator from './WhaleCalculator';

window.altamoonPlugin((store: t.RootStore) => {
  const { currentScript } = document;
  if (!currentScript) throw new Error('Unable to detect currentScript');
  const { element } = store.customization.createWidget({
    id: 'whale_calculator',
    hasSettings: false,
    title: 'Whale Calculator',
    currentScript,
    layout: {},
  });

  render((
    <Provider value={store}>
      <WhaleCalculator />
    </Provider>
  ), element);
});
