# altamoon-plugins

> [monorepo](https://en.wikipedia.org/wiki/Monorepo) for official [Altamoon](https://github.com/Altamoon/altamoon) plugins and plugin examples.

- [altamoon-phlegmatic](https://github.com/Altamoon/altamoon-plugins/tree/main/packages/phlegmatic) - Altamoon plugin that imitates human behavior to close Binance future positions.
- [altamoon-hello-world](https://github.com/Altamoon/altamoon-plugins/tree/main/packages/hello-world) - Altamoon example plugin for beginner developers.
- [altamoon-hello-world-react](https://github.com/Altamoon/altamoon-plugins/tree/main/packages/hello-world-react) - Altamoon example plugin powered by TypeScript, Webpack and React for experienced developers.

![image](https://user-images.githubusercontent.com/1082083/132655914-b24f0aa6-905e-4005-bd00-224ff858751f.png)

## Overview 

Altamoon plugins are published at NPM via `npm publish`, therefore every plugin has its own version. By the time being the latest plugin version is used once installed but later we're going to need to restrict that to avoid incompatibility issues and improve Altamoon's security (in case the author's NPM package access is corrupted). We also may want to add a "compatibility" field to package.json to make developers define which versions of Altamoon are compatible with the plugin (Altamoon is going to need to follow [Semantic Versioning](https://semver.org/)).

The package.json file of any plugin needs to include a `"main"` field that points to the plugin code **bundled as a single JavaScript file** or/and a `"style"` field that points to a **single CSS file**.

```json
{
  "name": "altamoon-awesome-plugin",
  "description": "My awesome plugin!",
  "main": "dist/bundle.js",
  "style": "dist/style.css",
  ...
```

This means that a plugin can be either a functional script to create widgets and run any custom JavaScript code or provide custom CSS styles without affecting Altamoon's functionality. 

Once a plugin is installed, it's going to be loaded via `<script>` tag using [UNPKG CDN](https://unpkg.com/) if `"main"` is provided and it's going to be loaded as `<link rel="stylesheet">` if `"style"` is provided. For example "Hello World" plugin is published as [altamoon-hello-world](https://www.npmjs.com/package/altamoon-hello-world) NPM package and loaded in the app as `<script src="https://unpkg.com/altamoon-hello-world"></script>.`

Every JavaScript plugin (plugins with `"main"` field in package.json) has full access to Altamoon features (current symbol, trading functions, stats, etc.) and can create any number of widgets (including none). Plugins are created with a global variable `window.altamoonPlugin` that accepts a function that is going to be called by Altamoon once the app is loaded.

The Altamoon API itself is going to be documented later.

```js
window.altamoonPlugin((store) => {
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

Widgets can be disabled and enabled again without stopping their plugin via the Widgets menu. If a widget is disabled, its plugin still has access to the app and personal data.

![image](https://user-images.githubusercontent.com/1082083/126359940-627c181c-a51f-4091-a435-fcdf85756f27.png)


## Third-party plugins

Some officially supported plugins may have "Third-party" label. 

![image](https://user-images.githubusercontent.com/1082083/126335242-c59523a5-3fc9-498f-90ea-46ef2058d3d9.png)

The label means that the plugin wasn't made by Altamoon team, therefore we can't guarantee that the plugin is safe to use. Users are going to see a warning once such plugin is disabled via Plugins menu that says that even though the plugin was turned off it still can control application and personal data (such as API keys).

![image](https://user-images.githubusercontent.com/1082083/126336113-88e7123f-ddd0-485f-8075-38f79b363ec2.png)


## Custom plugins

Besides enabling official plugins, it is possible to add a plugin using its name on NPM,

![image](https://user-images.githubusercontent.com/1082083/132657486-1e1757ee-209d-489a-8325-c1c61b5dbba7.png)

provide direct URL to a JavaScript file.

![image](https://user-images.githubusercontent.com/1082083/132657640-10457f8d-4c58-42fb-bec6-24e18c49a8d2.png)

or provide direct URL to a CSS file.

![image](https://user-images.githubusercontent.com/1082083/132657702-121dafcd-5058-4883-86f6-5035412b8f90.png)


## TypeScript

Altamoon plugins can be implemented with TypeScript. Types are published as [altamoon-types](https://www.npmjs.com/package/altamoon-types) package.

```ts
import * as t from 'altamoon-types';

window.altamoonPlugin((store: t.RootStore) => {
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

All official Altamoon plugins are implemented with [React](https://reactjs.org/) but it's [not a requirement](https://github.com/Altamoon/altamoon-plugins/tree/main/packages/hello-world). An example of such plugin can be found at [hello-world-react](https://github.com/Altamoon/altamoon-plugins/tree/main/packages/hello-world-react). The example also demonstrates hot module replacement: a feature for development environment that allows to re-render components at runtime after code changes without needing to reload the whole application.

![](https://raw.githubusercontent.com/Altamoon/altamoon-plugins/main/.assets/hmr.gif)


 

