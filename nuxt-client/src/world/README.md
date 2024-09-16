# World and Generation

> **NOTE:** This section of the documentation is divided into [World](#world) and [Generation](#generation). `world.ts` is a defacto main file in which almost all of the code in this project is called.

# World

## Constructor

The instance of `World` is created in the `play.vue` file of the Nuxt project. It accepts arguments of an HTML Canvas, environment variables, and a callback function for managing the loading bar.

In the constructor, the following are initialized:

- Babylon Canvas Engine
- Babylon Scene
- GUI
- Websocket connection
- Mesh Generator (see [Generation](#Generation))
- Physics Engine (using OimoJS)
- WebXRSessionManager
- Various hardware scaling optimizers

## Initialization

The `init()` function initializes essential facets of the game such as

- [Ground](#ground)
- [Audio](#audio)
- [Lighting](#lighting)
- [Debug](#debug)
- [Render Loop](#render-loop)

### Ground

The ground is created with the Babylon `MeshBuilder` method of `.CreateGround()`. Its position is set (0, 0, 0) and a Physics Impostor is created.

> _A Physics Impostor is created to allow for complex collisions to occur between meshes. Physics Impostors are created for all meshes in this project._

Images of grass for the ground are fetched from the CMS. With these images, textures are created using Babylon `Texture(url, scene)`.

### Audio

Multiple different sounds are created for the game. All of the audio files are fetched from the CMS. All of these sounds are created using Babylon `Sound(name, url, scene)`.

- Music is created and played on loop
- An event listener is set for the `W` `A` `S` and `D` keys to play walking sounds while the player is in motion.
- Intervals are set to play 3 different wind noises

### Lighting

We use both ambient, hemisphere lights as well as point lights for the sun and moon. `HemisphericLight(...)` and `PointLight(...)` are employed respectively.

Meshes and materials are created for the sun and moon, so as to create a convincing day/night cycle using real in-game models.

The sky is created using different cube textures fetched from the CMS.

Calculations are done to position the sun and moon models in the sky, as well as rotate the day and night sky models.

### Debug

A debug layer is created using Babylon `DebugLayer()`

### Render Loop

The Babylon Engine runs using the `Engine.runRenderLoop(renderFunction)` method. In the renderFunction, the scene is rendered and [\_updateRender()](#_updaterender) is called.

## Methods

### `_updateRender()`

This function is called everytime the engine renders.

- The state machine checks that all of the data it has is valid
- A socket message is sent to the server, sending position and rotation information from the client.

### `_initCamera()`

If VR is chosen, VR is initialized using the WebXRSessionManager

If VR is not chosen, a camera is initialized using Babylon `FreeCamera()`

### `_init()`

[See Initialization](#initialization)

### `listen()`

Listens for window close in order to send closing message to websocket.

### `_castRay()`

Creates a ray from the user's camera.

### `_evaluateDistance(mesh)`

Measures the distance between the user and a given mesh.

Returns the distance.

### `_castLookingRay()`

Creats the same ray as `_castRay()`. The difference is that this method allows you to pick up objects.

This function is called repeatedly, and has an event listener for the "pickup" keybind. When that button is pressed, the ray identifies the mesh that the user is aiming at.

### `_initClient(name, id)`

Initializes a new user using the `MainPlayer()` class.

### `_initPlayer(player)`

Adds a player to the `this._players` map

### `onSocketData(data)`

When the socket connection receives a message, this function is called. It contains a switch case for every possible `PacketType`

# Generation

## SoundLoader

Sets and gets sounds

## MeshLoader

Loads meshes using the CMS and caches them. When the meshes are requested by the main Generation class, it sends the mesh.

## Generation

Contains functions that are called to generate meshes.

When a message from the websocket server is received saying to generate a mesh, its respective function is called and the mesh is generated. These functions are called in the World class.
