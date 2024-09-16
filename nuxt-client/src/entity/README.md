# Entity

Contains classes for player and non-player entities.

## Entities

Contains the classes for non-player entities. Also includes the function `createEntity(...)` which is used to create non-player entities.

## Player

Contains the class for any player.

This includes

- name
- health
- exp
- position
- rotation
- id
- user mesh
- name tag

## Main Player

Contains the class for the user player. `MainPlayer` extends `Player`. The main difference is the attachment of a camera to the player. Another difference is pointerlock.
