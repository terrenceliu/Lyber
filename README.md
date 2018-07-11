# Lyber

## About

[Really needs catchy project description ummm]

Lyber is available on iOS. Repo link: https://github.com/EdwardFeng523/Lyber-ios

Lyber is currently deployed on Heroku. Link: https://lyber-app.herokuapp.com/


## Feature

- [ ] Price Compare

- [ ] ETA / Drive availabity estimate

- [ ] Surge charge alert

- [ ] Apply personal Promo

- [ ] Save routes/places

- [ ] Display price history



## TODO

- [x] CLEAN UP THE CODE URGHHH ITS SO MESSY RN

- "Current Position": 

- [x] add button

- [x] get lat/lng

- [ ] synchronize autocomplete w/ current pos

- "Map"

- [x] Drag/Pin to select location

- [ ] Update address info in autocomplete after dragging the marker

- [ ] Display estiamted routes

- "Item card":

- [ ] Display available drivers nearby/wait time

- [ ] Display ETA

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





