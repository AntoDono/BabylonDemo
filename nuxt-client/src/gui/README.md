# GUI and Hotbar

These classes deal with the overlay of the game.

## Usage

When a new instance of `GUI` is created, it accepts an argument of `scene`. In the constructor of `GUI`, a Babylon FullscreenUI is created (`GUI._mainGUI`). The constructor also creates a new instance of `Hotbar`, which accepts `GUI._mainGUI` as an argument. The hotbar is then initialized, which renders the crosshairs on the UI.

The main instance of `GUI` is initialized in `..\world\world.ts`

> **NOTE:** The UI is fetched from a server hosted by Babylon. If you would like to change the UI, you must visit the [Babylon GUI Editor](https://gui.babylonjs.com/). Once you are done creating/modifying an interface, obtain its snippet and version and change their respective values in the Hotbar class.

## Methods

### `disposeGUI()`

This disposes the interface.
