# biduul-plugins

> [monorepo](https://en.wikipedia.org/wiki/Monorepo) for official [Biduul](https://github.com/Letiliel/biduul) plugins and plugin examples.

- [biduul-phlegmatic](https://github.com/Letiliel/biduul-plugins/tree/main/packages/phlegmatic) - Biduul plugin that imitates human behavior to close Binance future positions.
- [biduul-hello-world](https://github.com/Letiliel/biduul-plugins/tree/main/packages/hello-world) - Biduul example plugin for beginner developers.
- [biduul-hello-world-react](https://github.com/Letiliel/biduul-plugins/tree/main/packages/hello-world-react) - Biduul example plugin powered by TypeScript, Webpack and React for experienced developers.

![image](https://user-images.githubusercontent.com/1082083/132655914-b24f0aa6-905e-4005-bd00-224ff858751f.png)

## Overview 

Biduul plugins are published at NPM via `npm publish`, trerefore every plugin has its own version. By the time being latest plugin version is used once installed but later we're going to need to restrict that to avoid incompatibility issues and improve Biduul security (in case if author's NPM package accesss was corrupted). We also may want to add "compatibility" field to package.json to make developers define which versions of Biduul are compatible to the plugin (Biduul is going to need to follow [Semantic Versioning](https://semver.org/)).

package.json file of any plugin needs to include `"main"` field that points to the plugin code **bundled as a single JavaScript file** or/and `"style"` field that points to a **single CSS file**.

```json
{
  "name": "biduul-awesome-plugin",
  "description": "My awesome plugin!",
  "main": "dist/bundle.js",
  "style": "dist/style.css",
  ...
```

This means that a plugin can be either of a functional script to be able to create widgets and run any custom JavaScript code but also provide custom CSS styles without affecting Biduul functionality. 

Once a plugin installed, it's going to be loaded via `<script>` tag using [UNPKG CDN](https://unpkg.com/) if `"main"` is provided and it's going to be loaded as `<link rel="stylesheet">` if `"style"` is provided. For example "Hello World" plugin is published as [biduul-hello-world](https://www.npmjs.com/package/biduul-hello-world) NPM package and loaded to the app as `<script src="https://unpkg.com/biduul-hello-world"></script>.`

Every JavaScript plugin (the plugin with `"main"` field at package.json) has full access to Biduul features (current symbol, trading functions, stats etc) and can create any number of widgets (either it's none or multiple). Plugins are created with a global variable `window.biduulPlugin` that accepts a function that is going to be called by Biduul once the app is loaded.

Biduul API itself is going to be documented later.

```js
window.biduulPlugin((store) => {
  const widget = store.customization.createWidget({
    ...
  });

  const createOrder = async (side, quantity) => {
    await store.trading.marketOrder({
      quantity, side, symbol: store.persistent.symbol,
    });
  };

...
```

Widgets can be disabled and enabled again without stopping their plugin via Widgets menu. If a widget is disabled, its plugin still has access to the app and personal data.

![image](https://user-images.githubusercontent.com/1082083/126359940-627c181c-a51f-4091-a435-fcdf85756f27.png)


## Third-party plugins

Some officially supported plugins may have "Third-party" label. 

![image](https://user-images.githubusercontent.com/1082083/126335242-c59523a5-3fc9-498f-90ea-46ef2058d3d9.png)

The label means that the plugin wasn't made by Biduul team, therefore we can't guarantee that the plugin is safe to use. Users are going to see a warning once such plugin is disabled via Plugins menu that says that even though the plugin was turned off it still can control application and personal data (such as API keys).

![image](https://user-images.githubusercontent.com/1082083/126336113-88e7123f-ddd0-485f-8075-38f79b363ec2.png)


## Custom plugins

Besides enabling official plugins, it is possible to add a plugin using its name on NPM,

![image](https://user-images.githubusercontent.com/1082083/132657486-1e1757ee-209d-489a-8325-c1c61b5dbba7.png)

provide direct URL to a JavaScript file.

![image](https://user-images.githubusercontent.com/1082083/132657640-10457f8d-4c58-42fb-bec6-24e18c49a8d2.png)

or provide direct URL to a CSS file.

![image](https://user-images.githubusercontent.com/1082083/132657702-121dafcd-5058-4883-86f6-5035412b8f90.png)


## TypeScript

Biduul plugins can be implemented with TypeScript. Types are published as [biduul-types](https://www.npmjs.com/package/biduul-types) package.

```ts
import * as t from 'biduul-types';

window.biduulPlugin((store: t.RootStore) => {
  const widget = store.customization.createWidget({
    ...
  });

  const createOrder = async (side: 'BUY' | 'SELL', quantity: number) => {
    await store.trading.marketOrder({
      quantity, side, symbol: store.persistent.symbol,
    });
  };

...

```

## React and Hot Module Replacement

All official Biduul plugins are implemented with [React](https://reactjs.org/) but it's [not a requirement](https://github.com/Letiliel/biduul-plugins/tree/main/packages/hello-world). An example of such plugin can be found at [hello-world-react](https://github.com/Letiliel/biduul-plugins/tree/main/packages/hello-world-react). The example also demonstrates hot module replacement: a feature of used code environment that allows to re-render components with no need to reload the application itself.

![](https://raw.githubusercontent.com/Letiliel/biduul-plugins/main/.assets/hmr.gif)


 

