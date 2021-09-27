import * as t from 'biduul-types';
import minichartGrid from 'minichart-grid';

window.biduulPlugin((store: t.RootStore) => {
  const { currentScript } = document;
  if (!currentScript) throw new Error('Unable to detect currentScript');
  const { settingsElement, element } = store.customization.createWidget({
    id: 'minichart_grid',
    hasSettings: true,
    canSettingsSave: false,
    title: 'Minichart Grid',
    currentScript,
    layout: { h: 8, w: 8, minH: 5 },
  });

  // add styles at dev mode manually because plugin system
  // doesn't have access to package.json#style field
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (process.env.NODE_ENV === 'development') {
    // retrieve script host, <a> tag is the simplest way to do that
    const a = document.createElement('a');
    a.href = currentScript.getAttribute('src') as string;
    const { origin } = a;

    // create stylesheet
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', `${origin}/style.css`);

    // make it to be removable when plugin is disabled
    link.dataset.pluginId = currentScript.dataset.pluginId;
    document.body.appendChild(link);
  }

  minichartGrid(element, {
    settingsContainer: settingsElement as HTMLElement,
    onSymbolSelect: (symbol) => {
      // eslint-disable-next-line no-param-reassign
      store.persistent.symbol = symbol;
    },
  });
});
