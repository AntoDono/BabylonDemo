# Skrunkle Server Side Source

This directory contains all of the source code for Skrunkle. Similar to the client side, it has `\entity` and `\world`. However, client side dependent folders such as `\gui` is removed. 

<br>

**Root Directory**

> Unlike the folder strcture on the client side, we have many essential classes we needed, such as: `logger`, `router`, `server (websocket)`, `state machine`, `generation`, and `packets`. The reason they do not have an individual further is because it would be redundant.

<br>
A complete list of root files (classes) are:

- Index
- Logger
- Packets
- Router
- Server
- State machine
- World

# Index

The index file is where the websocket server is being initiated.

# Logger

The logger is a way for server side debug or loggin essential server information. For each file that you use logger in, it is best practice to instantiate a new instance of logger.

## Methods

### `constructor(section)` 
This is the constructor of the logger, it will take in an argument `section` _(type string)_, which represents the name the logger will log. This is used to pinpoint which file the logger is printing from.

### `log(message)`
This method takes in an argument `message` (string). The logger will log the `message` in __cyan__ in the console.


### `warn(message)`
This method takes in an argument `message` (string). The logger will log the `message` in __yellow__ in the console.

### `error(message)`
This method takes in an argument `message` (string). The logger will log the `message` in __red__ in the console.

### `pass(message)`
This method takes in an argument `message` (string). The logger will log the `message` in __green__ in the console.

### `progress(message)`
This method takes in an argument `message` (string). The logger will log the `message` in __magenta__ in the console.

<br>

# Packets

The packet class is essentially a data class. It has a constructor that takes in `packetType` (PacketType), `data` (array of any), `uid` (string).

## PacketType
There are a total of 9 packet types, each one is linked to the client and performs different operations:

- `ipdate`: updates the players on client side
- `info`: initial server info to setup client side
- `movement`: main player movements from client side
- `mesh`: mesh information of the server
- `close`
- `interaction`: player interaction entities
- `chat`: chat messages sent from other clients
- `player_creation`: information sent to the client to instantiate a new player
- `request_mesh`: sends information about a specific mesh

# State Machine
State machine keeps track of all server entities, this includes players and npcs. The difference between the server and client side state machine is that the client side has a shadow generator. Since the server side doesn't require rendering, it is not necessary to have a shadow generator for server side.

> The state machine will constantly broadcast the player and dynamic entity positions (static ones such as trees, houses will only be broadcasted once when a new client connects).

## Methods

### `ready()`
This function checks to see if the state machine has `world` and `socket` reference. If it does, it is ready to update. If not, it will do nothing.



