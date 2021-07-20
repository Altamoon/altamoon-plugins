# biduul-plugins

The README is in progress...

This is the [monorepo](https://en.wikipedia.org/wiki/Monorepo) for official [Biduul](https://github.com/Letiliel/biduul) plugins. 

![image](https://user-images.githubusercontent.com/1082083/126315449-5bacd995-0c72-4bb2-a687-fb5db77a7260.png)



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

All official Biduul plugins are implemented with [React](https://reactjs.org/) but it's [not a requirement](https://github.com/Letiliel/biduul-plugins/tree/main/packages/hello-world). An example of such plugin can be found at [hello-world-react](https://github.com/Letiliel/biduul-plugins/tree/main/packages/hello-world-react). The example also demonstrates hot module replacement: the environment feature that allows to re-render components with no need to reload the application completely.

![](./assets/hmr.gif)

## Publishing

Biduul plugins are published at NPM via `npm publish`, trerefore every plugin has its own version. By the time being 

## Third-party plugins

## Custom plugins

## Simple widget example code
