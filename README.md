# Lyber

## About

Estimate fares. Compare services. All in one. 

Lyber is currently deployed on Heroku. Link: https://lyber-app.herokuapp.com/

Lyber is available on iOS. Repo link: https://github.com/EdwardFeng523/Lyber-ios


## Feature

- Compare ride services between Uber and Lyft across every products available in thousands of cities worldwide

- Seamless integration with Uber & Lyft API. Get the ride straight from the website.

- Integrate with Google Maps API. Just drag and drop to pin-point your pick up location.




## TODO

- [x] CLEAN UP THE CODE URGHHH ITS SO MESSY RN

- "Current Position": 

- [x] add button

- [x] get lat/lng

- [x] synchronize autocomplete w/ current pos

- "Map"

- [x] Drag/Pin to select location

- [x] Update address info in autocomplete after dragging the marker

- [ ] Display estiamted routes

- "Item card":

- [ ] Display available drivers nearby/wait time

- [x] Display ETA

- [X] Format card components (ummm sort of)


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





