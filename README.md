# SoPra FS23 – Stratego

## Introduction

Stratego is a classic board game has been enjoyed by many strategy enthusiasts over years. The project aims to create an online version of the game where worldwide players can easily access. Stratego is a 1vs1 game which requires careful planning, deduction, and bluffing, as players attempt to determine the ranks of their opponent’s hidden pieces and make tactical decisions. To start a game, users need to register first. A registered user can start a game by creating a room or joining an available room. After each game, they can choose to play with the same person again or go to lobby to find new challengers. Profile provides a record of the player's wins and losses, allowing players to track their progress and compare achievements.

## Technologies

<img src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg" width="16" height="16" />   [**React**](https://reactjs.org/) 

<img src="https://github.com/get-icon/geticon/blob/master/icons/nodejs-icon.svg" width="16" height="16" /> [**node.js**](https://www.npmjs.com) 

<img src="https://github.com/get-icon/geticon/blob/master/icons/material-ui.svg" width="16" height="16" /> [**Mui**](https://mui.com/)	

<img src="https://user-images.githubusercontent.com/91155454170843632-39007803-3026-4e48-bb78-93836a3ea771.png" style='visibility:hidden;' width="16" height="16" /> [**WebSocket**](https://en.wikipedia.org/wiki/WebSocket)

<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" width="16" height="16" /> [**JavaScript**](https://www.javascript.com/)	

<img src="https://user-images.githubusercontent.com/91155454/170842503-3a531289-1afc-4b9c-87c1-cc120d9229ce.svg" style='visibility:hidden;' width="16" height="16" /> [**REST**](https://en.wikipedia.org/wiki/Representational_state_transfer) 

<img src="https://github.com/get-icon/geticon/blob/master/icons/github-icon.svg" width="16" height="16" /> [**GitHub**](https://github.com/)	

## High-level components

Since users directly interact with views, so we considered views as the main components of front-end.

### Lobby
After registration or login, the user directly enters lobby page, where on the left side an online-user list is displayed. Users can edit their own profile or check others' profile either by clicking on the username displayed on the online-user list or entering a username in the search box. To start a game, the user can either create a new room and wait for the opponent or join an available room showning in the room list.


### GamePreparing
GamePreparing view itself displays half of the gameboard which is assigned to the two opponents seperately according to colors (which are decided by the order they enter the room). Players can set up their own army formation by swaping pieces. In addition, it displays on the left side the two opponents.

### OngoingGame
The OngoingGame component handles the ongoing gameplay logic, including updating the game board, current player information and if the player wants to resign. In addition, it delegates the Board component to handle user interactions with the game board, including selecting pieces, dragging and dropping them. The Board also dynamically renders the game board based on the provided data.


## Launch & Deployment
<p>
Follow the instruction to get a copy of the project up and run on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
</p>

### Prerequisites and Installation
Get the [Stratego server](https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-server) and [Stratego client](https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client) repository from GitHub and follow the installation guide in each repository.

Get the client and open the project with an IDE of your choice.

```bash
git clone https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client.git
```


For your local development environment, you will need [Node.js](https://nodejs.org). All other dependencies, including React, get installed with:

```bash
npm install
```

Run this command before you start your application for the first time. Next, you can start the app with:

```bash
npm run dev
```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build
This command builds the app for production to the `build` folder.
```bash
npm run build
```
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Testing
There is currently no test on Stratego client.

Tests can be run with the command:  
```bash
npm run test
```

This launches the test runner in an interactive watch mode. 
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


### Deployment
After each commit to the main branch, automatic Github Actions get executed which deploy our application to [Google Cloud](https://cloud.google.com/).

## Illustrations


