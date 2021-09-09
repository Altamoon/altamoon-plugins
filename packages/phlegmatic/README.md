# biduul-phlegmatic [![npm version](https://badge.fury.io/js/biduul-phlegmatic.svg)](https://badge.fury.io/js/biduul-phlegmatic)

> Biduul plugin that imitates human behavior to close Binance future positions

The plugin includes the following "strategies" to close positions:
- **Pull profit** allows to prtially take profit when PNL reaches given PNL level every given amount of time.
- **Take profit** works similar to the regular TP feature but waits for a given amount of time to pass while PNL is above given percentage to protect from the sutiation when PNL is high for just a moment.
- **Reduce loss** works similar to "Pull profit" but the other way around. It checks if PNL is below given percentage and partially closes position every given amount of time to protect from bigger losses if PNL drops more. 
- **Stop loss** works similar to the reguar SL feature but protects from situations when PNL drops quickly but restores in a moment. It doesn't protect from situations when price drops but doesn't restore back.
- **Recover** allows to extend position if PNL drops below given percentage.

To see what does the plugin exactly do, take a look at the screenshots below which are quite self-explanatory.

## Install

To use the plugin select "Plugins" at Biduul UI and switch biduul-phlegmatic plugin on.

![image](https://user-images.githubusercontent.com/1082083/126187942-01e20216-9a70-415b-a590-44f7cbdce8a8.png)

![image](https://user-images.githubusercontent.com/1082083/126346192-9c529c1f-2786-4e18-80be-2412d4a1b4ab.png)

## Usage

The plugin comes with all the strategies turned off out from the box. The "Default" settings define how new positions should behave once they open.

![image](https://user-images.githubusercontent.com/1082083/126350917-045f2e7a-c27e-4a4c-a432-e37a1d08ca22.png)

Once a position is created, it can be controled individually.

![image](https://user-images.githubusercontent.com/1082083/126351059-fdf9b96d-0052-4d33-98f8-d1166b418f9f.png)

**Important!** It's recommended to turn off a strategy before changing its numbers to clean up intervals and avoid perventage issues; enable them after the numbers are set up.

Plugin settings allow to define what type of PNL is used: "Position PNL" or "True PNL".

![image](https://user-images.githubusercontent.com/1082083/126351574-05617fde-d148-4ec7-8690-a22106d1bdd1.png)


## Develop

- Install [NodeJS](https://nodejs.org/en/).
- Clone the repository and go the plugin folder (`cd biduul-plugins/packages/phlegmatic`).
- Run `npm ci` to install dependencies.
- Run `npm run dev` to start [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/).
- Use "Add custom plugin" Biduul feature and paste `http://localhost:8083/bundle.js` to add the plugin.
