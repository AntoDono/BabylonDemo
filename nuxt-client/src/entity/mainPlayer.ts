// @ts-nocheck

import {
  Vector3,
  UniversalCamera,
  Mesh,
  Scene,
  FreeCamera,
  MeshBuilder,
} from "@babylonjs/core";
import { Player } from "./player";

export class MainPlayer extends Player {
  #camera: FreeCamera;
  private _canvas: HTMLCanvasElement;
  private _inventory: Map<number, PlayerItem> = new Map();
  private _hotbar: Hotbar;

  constructor(
    name: string,
    health: number,
    exp: number,
    position: Vector3,
    rotation: Vector3,
    id: string,
    scene: Scene,
    canvas: HTMLCanvasElement | null,
    freeCamera: FreeCamera
  ) {
    super(name, health, exp, position, rotation, id, scene, {
      renderBody: false,
      mainPlayer: true,
    });

    //@ts-ignore
    this._canvas = canvas;
    // this.scene.gravity = new Vector3(0, -9.81, 0);

    this.#camera = freeCamera;
    this.#camera.attachControl(canvas, true);
    this.#camera.inertia = 0.5;
    this.#camera.checkCollisions = true;
    // this.#camera.applyGravity = true;
    // (<any>this.#camera)._needMoveForGravity = true;

    this.#camera.keysUp = [87]; // W
    this.#camera.keysDown = [83]; // A
    this.#camera.keysLeft = [65]; // S
    this.#camera.keysRight = [68]; // D

    this._createPointerLock();
  }

  private _createPointerLock(): void {
    if (this._canvas) {
      this._canvas.addEventListener(
        "click",
        (event) => {
          this._canvas.requestPointerLock =
            this._canvas.requestPointerLock ||
            this._canvas.msRequestPointerLock ||
            this._canvas.mozRequestPointerLock ||
            this._canvas.webkitRequestPointerLock;
          if (this._canvas.requestPointerLock) {
            this._canvas.requestPointerLock();
          }
        },
        false
      );
    }
  }

  public get position(): Vector3 {
    return this.#camera.position;
  }

  public set position(new_position: Vector3) {
    this.#camera.position = new_position;
  }

  public get rotation(): Vector3 {
    return this.#camera.rotation;
  }
}
