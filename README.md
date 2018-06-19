# Lyber

## About
[Project description goes here lol]

Lyber is available on iOS. Project link: https://github.com/EdwardFeng523/Lyber-ios


## TODO

- "Current Position": 

- [ ] add button

- [ ] get lat/lng

- "Map"

- [ ] Drag/Pin to select location

- [ ] Update address info in autocomplete after dragging the marker

- [ ] Display estiamted routes

- "Item card":

- [ ] Display available drivers nearby/wait time

- [ ] Display ETA

- [ ] Format card components


## Getting Started

### Installing

```
git clone https://github.com/terrenceliu/Lyber.git
cd Lyber
npm install
```

### Run Locally
```
npm run start
```

### Development setup

Under the project directory, open a new terminal and run
```
npm run watch
```

Open another new terminal and run
```
npm run start
```

The `watch` script turns on the watch mode. Webpack will continue to watch for changes in any of the resolved files. 

The `start` script will spawn a dev server which reloads the page when you save the files. The server runs at `http://localhost:8080` and will automatically open up.

### Expose dev server to LAN


To start a dev server that could be accessed from any devices on our local network (LAN), run
```
npm run start:lan
```

Then we could visit the dev server with the url `http://<local ip address>:8080`

To look up the local ip address, run
```
ifconfig -a
```





