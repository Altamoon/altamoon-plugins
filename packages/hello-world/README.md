# biduul-hello-world

> A Biduul plugin example

The plugin provides basic functionality to buy or sell given quantity of tokens. 

![image](https://user-images.githubusercontent.com/1082083/125951680-2b9a64f7-6b6e-44c8-80ba-3556cb15500f.png)

It also demonstrates how to implement plugin settings. At this case it does nothing more than Buy and Sell button size change.

![image](https://user-images.githubusercontent.com/1082083/125952310-7fdaa428-4f26-4f7c-a645-2a2290d111b6.png)


## Install

To install the plugin select "Plugins" at Biduul UI, paste `biduul-hello-world` to "Add custom plugin" field and click "Add plugin"

![image](https://user-images.githubusercontent.com/1082083/125951305-df05c768-05eb-4ac3-ab7e-4e9efba5807c.png)

![image](https://user-images.githubusercontent.com/1082083/125951391-958f22a2-d337-43cf-904b-6bf111137630.png)



## Develop

There is no environment limitation. index.js file is the complete plugin file that needs to be served by any server (NodeJS, Nginx, Apache...). This instruction is based on a simple NodeJS server installed as NPM package.

- Clone the repository and go the plugin folder (`cd biduul-plugins/packages/hello-world`)
- Run `npm ci` to install dependencies.
- Run `npm run dev` to run a simple HTTP server.
- Use "Add custom plugin" Biduul feature and paste `http://localhost:8082/index.js` to add the plugin.
- If you make a change to index.js file you need to reload Biduul via Ctrl + R.

