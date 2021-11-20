# altamoon-hello-world-react [![npm version](https://badge.fury.io/js/altamoon-hello-world-react.svg)](https://badge.fury.io/js/altamoon-hello-world-react)

> A altamoon plugin example powered by TypeScript, Webpack and React

The plugin provides basic functionality to buy or sell given quantity of tokens (as well as [the basic hello-world example](https://github.com/Altamoon/altamoon-plugins/tree/main/packages/hello-world)).

![image](https://user-images.githubusercontent.com/1082083/126187782-2cbe78f2-9e8a-44e1-9c98-ddffc5264489.png)

It also demonstrates how to implement plugin settings. At this case it does nothing more than Buy and Sell button size change.

![image](https://user-images.githubusercontent.com/1082083/126191597-b27a1e1c-7b34-4988-8757-088322b39ae3.png)

## Install

To install the plugin select "Plugins" at Altamoon UI, paste `altamoon-hello-world-react` to "Add custom plugin" field and click "Add plugin"

![image](https://user-images.githubusercontent.com/1082083/126187942-01e20216-9a70-415b-a590-44f7cbdce8a8.png)

![image](https://user-images.githubusercontent.com/1082083/126188079-c3056b0e-fbd8-47b5-a324-184d6a5f9321.png)

## Develop

- Install [NodeJS](https://nodejs.org/en/)
- Clone the repository and go the plugin folder (`cd altamoon-plugins/packages/hello-world-react`).
- Run `npm ci` to install dependencies.
- Run `npm start` to start [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/)
- Use "Add custom plugin" Altamoon feature and paste `http://localhost:8081/bundle.js` to add the plugin.

The example supports [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) intended to make plugin development faster.

![](https://raw.githubusercontent.com/Altamoon/altamoon-plugins/main/.assets/hmr.gif)
