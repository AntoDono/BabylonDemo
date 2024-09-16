# Entity

Contains classes for player and non-player entities such as NPCs.
Similar to client side entities, except main player and NPCs are removed.

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
- body (object)
- serialization

## NPCs

NPCs are used to represent `non player characters`, such as `whalen sheeps`. This class is used to control the different NPCs' movements. 

Methods include:

- `getRandomDestination`: generate random location for the NPC to move to.
- `wander`: moves the npc to the random location generated at even intervals of distance so a moving effect can be reflected on the client side.

## Items

Items is a class that is used to represent floating items in the `world`. It is a class that inherits `entity`.

Properties includes:

- name
- amount
- name
- id
- position

This class was not implemented due to the course of game being developed.