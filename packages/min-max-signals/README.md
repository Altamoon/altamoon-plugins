# altamoon-min-max-signals [![npm version](https://badge.fury.io/js/min-max-signals.svg)](https://badge.fury.io/js/min-max-signals)

> Signals at minimum or maximum for last 24h

The plugin notifies when a future market is at its minimum or maximum for last 24 hours.

## Develop

- Install [NodeJS](https://nodejs.org/en/)
- Clone the repository and go the plugin folder (`cd altamoon-plugins/packages/min-max-signals`).
- Run `npm ci` to install dependencies.
- Run `npm start` to start [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/)
- Use "Add custom plugin" Altamoon feature and paste `http://localhost:8084/bundle.js` to add the plugin.

The example supports [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) intended to make plugin development faster.

![](https://raw.githubusercontent.com/Altamoon/altamoon-plugins/main/.assets/hmr.gif)
