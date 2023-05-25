<div align="center">
    <img width="50%" src="https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client/blob/main/src/styles/img/Stratego_logo.png" alt="Logo">
</div>

# SoPra FS23 – Stratego


## Introduction

Stratego is a classic board game has been enjoyed by many strategy enthusiasts over years. The project aims to create an online version of the game where worldwide players can easily access. Stratego is a 1vs1 game which requires careful planning, deduction, and bluffing, as players attempt to determine the ranks of their opponent’s hidden pieces and make tactical decisions. To start a game, users need to register first. A registered user can start a game by creating a room or joining an available room. After each game, they can choose to play with the same person again or go to lobby to find new challengers. Profile provides a record of the player's wins and losses, allowing players to track their progress and compare achievements.

## Table of Contents

- [SoPra FS23 – Stratego](#sopra-fs23--stratego)
  - [Introduction](#introduction)
  - [Technologies](#technologies)
  - [High-level components](#high-level-components)
    - [User Information Management](#user-information-management)
    - [Lobby](#lobby)
    - [Game](#game)
  - [Get started](#get-started)
    - [Prerequisites and Installation](#prerequisites-and-installation)
    - [Build](#build)
    - [Testing](#testing)
    - [Deployment](#deployment)
  - [Illustrations](#illustrations)
    - [Register&Login Page](#register-login-page)
    - [Lobby Page](#lobby-page)
    - [Game Play](#game-play)
  - [Roadmap](#roadmap)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)
  - [Links](#links)

## Technologies

<img src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg" width="16" height="16" />   [**React**](https://reactjs.org/) 

<img src="https://github.com/get-icon/geticon/blob/master/icons/nodejs-icon.svg" width="16" height="16" /> [**node.js**](https://www.npmjs.com) 

<img src="https://github.com/get-icon/geticon/blob/master/icons/material-ui.svg" width="16" height="16" /> [**Mui**](https://mui.com/)	

<img src="https://user-images.githubusercontent.com/91155454/170843632-39007803-3026-4e48-bb78-93836a3ea771.png" style='visibility:hidden;' width="16" height="16" /> [**WebSocket**](https://en.wikipedia.org/wiki/WebSocket)

<img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" width="16" height="16" /> [**JavaScript**](https://www.javascript.com/)	

<img src="https://user-images.githubusercontent.com/91155454/170842503-3a531289-1afc-4b9c-87c1-cc120d9229ce.svg" style='visibility:hidden;' width="16" height="16" /> [**REST**](https://en.wikipedia.org/wiki/Representational_state_transfer) 

<img src="https://github.com/get-icon/geticon/blob/master/icons/github-icon.svg" width="16" height="16" /> [**GitHub**](https://github.com/)	

<img src="https://sv443.net/cdn/jokeapi/icon_readme.png" width="16" height="16" /> [**Joke API**](https://v2.jokeapi.dev/)

## High-level components

- [User Information Management](#user-information-management)
- [Lobby](#lobby)
- [Game](#game)

### User Information Management
Users are able to edit their username and check other users' profile after login or registration. Users could find users by using search box on lobby page. Users' username, id, game statistics are displayed on profile page.
 - [Register](src/components/views/Register.js)
 - [Login](src/components/views/Login.js)
 - [Profile](src/components/views/Profile.js)

### Lobby
Exsiting rooms are displayed on lobby page. Users could join an available room by clicking <code>JOIN</code> button or create a new room by clicking <code>CREATE ROOM</code> button.
- [Lobby](src/components/views/Lobby.js)
- [Room](src/components/views/Room.js)

### Game
The GamePreparing component prepares players with their initial borad. The OngoingGame component handles the game logic, including updating the game board, current player information and if the player wants to resign. In addition, it delegates the Board component to handle user interactions with the game board, including selecting pieces, dragging and dropping them. The Board also dynamically renders the game board based on the provided data.
- [GamePreparing](src/components/views/GamePreparing.js)
- [OngoingGame](src/components/views/OngoingGame.js)

## Get started
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

### Testing
There is currently no test on Stratego client.

Tests can be run with the command:  
```bash
npm run test
```

### Deployment
After each commit to the main branch, automatic Github Actions get executed which deploy our application to [Google Cloud](https://cloud.google.com/).

## Illustrations

### Register Login Page
<p>
    After registration, users could login.
<div align="center">
   <img width="80%" src="https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client/blob/readme-media/images/Register.png">
</div>
<div align="center">
   <img width="80%" src="https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client/blob/readme-media/images/Login.png">
</div>
</p>

### Lobby Page
<p>
    After registration or login, the user directly enters lobby page, where on the left side an online-user list is displayed. Users can edit their own profile or check others' profile either by clicking on the username displayed on the online-user list or entering a username in the search box. To start a game, the user can either create a new room and wait for the opponent or join an available room shown in the room list.
</p>
<div align="center">
   <img width="80%" src="https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client/blob/readme-media/images/Lobby.png">
</div>


### Game Play
Users could enter game by clicking <code>Enter Game</code> when the room has two players. Players will set up their board first. Legal moves or attacks will be highlighted on the board while clicking one piece. Players could choose to resign or play until someone wins. Game result will pop if someone wins. Users could choose to return to lobby page or room page to play again.
<div align="center">
   <img width="80%" src="https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client/blob/readme-media/gif/Gameplay.gif">
</div>

## RoadMap
- Add friend function.
User can add others by sending requests and unfriend friends directly.
- Add Chat funtion using external api.
Users can send messages to other users on lobby page or send messages to opponent while playing the game.

## Authors

* **Anqi Xu**  - [anqiXu33](https://github.com/anqiXu33)
* **Chenfei Xiong**  - [rChenfeiXiong](https://github.com/rChenfeiXiong)
* **Jiachen Bao** - [jiachencindybao](https://github.com/jiachencindybao)
* **Shiran Liu** - [ShiranLiu](https://github.com/ShiranLiu)
* **Stefan Plüss** - [stefanpluess](https://github.com/stefanpluess)


## License
This project is licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html), which guarantees end users the freedoms to run, study, share and modify the software.

## Acknowledgements
* This project is based on the [SoPra FS23 - Client Template](https://github.com/HASEL-UZH/sopra-fs23-template-client)
* Thanks to **Hyeongkyun Kim** - [hk-kaden-kim](https://github.com/hk-kaden-kim) who supported us as a TA during this project.

## Links
* [Stratego Client Website](sopra-fs23-group-22-client.oa.r.appspot.com)
* [Stratego Server Website](sopra-fs23-group-22-server.oa.r.appspot.com)
* [SonarCloud](https://sonarcloud.io/organizations/sopra-fs23-group-22/projects)
* [Issue tracker](https://github.com/sopra-fs23-group-22/sopra-fs23-group-22-client/issues)

