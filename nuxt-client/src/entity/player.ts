// @ts-nocheck

import {
  Mesh,
  Scene,
  MeshBuilder,
  Vector3,
  SceneLoader,
  TransformNode,
  DynamicTexture,
  Plane,
  StandardMaterial,
  VertexBuffer,
  Quaternion
} from "@babylonjs/core";
import { PhysicsImpostor } from "babylonjs";

export class Player {
  private _name: string;
  private _health: number;
  private _exp: number;
  private _position: Vector3;
  private _rotation: Vector3;
  private _id: string;
  public _body: Mesh ;
  private _scene: Scene;
  private _nametag: Mesh;
  private _nametag_y_offset: number = 0.5;

  private env: any;
  private player_body_scale = 1.75;

  constructor(
    name: string,
    health: number,
    exp: number,
    position: Vector3,
    rotation: Vector3,
    id: string,
    scene: Scene,
    options: { renderBody?: boolean; mainPlayer?: boolean } = {
      renderBody: true,
      mainPlayer: false,
    },
    env: any
  ) {
    this.env = env;

    this._name = name;
    this._health = health;
    this._exp = exp;
    this._id = id;
    this._scene = scene;

    this._loadBody(options);
    this._position = position;
    this._rotation = new Vector3(Math.PI / 2, Math.PI, 0);

    /*NAME TAG*/
    if (!options.mainPlayer) {
      this._nametag = MeshBuilder.CreatePlane(
        this._id,
        { width: 2, height: 2 },
        this._scene
      ); // fix ltr
      let planeMat: StandardMaterial = new StandardMaterial(
        "NameTagMaterialMaterial",
        this._scene
      );
      let planeTexture: DynamicTexture = new DynamicTexture(
        "NametagTexture",
        { width: 750, height: 256 },
        this._scene
      );
      planeTexture.getContext();
      planeTexture.hasAlpha = true;
      planeTexture.drawText(
        this._name,
        0,
        75,
        "bold 75px Arial",
        "black",
        null,
        true,
        true
      );
      planeMat.backFaceCulling = false;
      planeMat.diffuseTexture = planeTexture;

      this._nametag.material = planeMat;
      this._nametag.metadata = "Player";
      this._nametag.billboardMode = Mesh.BILLBOARDMODE_ALL;
      this._nametag.position = new Vector3(
        this._position.x,
        this._position.y + this._nametag_y_offset,
        this._position.z
      );
    }
  }

  private async _loadBody(options: any) {
    if (options.renderBody) {
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env['CMS']}/meshes/`,
        "player.babylon"
      );
      
      let meshes: Mesh[] = []
      bodies.meshes.forEach((m: any)=>{
        if (!m.getVerticesData(VertexBuffer.PositionKind)){
          // console.log("problems with: " + m.name);
        }else{
          meshes.push(m)
        }
      })
    
      let player_body: any = Mesh.MergeMeshes(meshes, true, false, undefined, false, true)

      player_body.scaling.x = this.player_body_scale 
      player_body.scaling.y = this.player_body_scale 
      player_body.scaling.z = this.player_body_scale 
      
      player_body.metadata = "player_body";
      player_body.name = this._name
      player_body.physicsImpostor = new PhysicsImpostor(player_body, PhysicsImpostor.MeshImpostor, { mass: 1, restitution: 0 }, this._scene)

      player_body.position = new Vector3(0, 100, 0)
      for (let i = 0 ; i < player_body.material.subMaterials.length; i ++){
        player_body.material.subMaterials[i].usePhysicalLightFalloff = false
      }

      this._body = player_body
      this._body.rotationQuaternion = Quaternion.FromEulerAngles(0, 0, 0)
    }
  }


  public get position(): Vector3 {
    return this._position;
  }

  public set position(new_position: Vector3) {
    this._position = new_position;
    if (this._body) {
      // this._body.position = this._position;
      // this._body.position = new Vector3(this._position.x, 0, this.position_z);
      this._body.position.x = new_position._x
      // this._body.position.y = 0
      this._body.position.z = new_position._z

      this._body.rotationQuaternion = Quaternion.FromEulerAngles(0, 0, 0)
    }
    if (this._nametag) {
      this._nametag.position = new Vector3(
        this._position.x,
        this._position.y + this._nametag_y_offset,
        this._position.z
      );
    }
  }

  public get rotation(): Quaternion {
    return this._body.rotationQuaternion;
  }

  public set rotation(new_rotation: Quaternion) {
    if (this._body) {
      this._body.rotationQuaternion.x = new_rotation._x
      this._body.rotationQuaternion.y = new_rotation._y
      this._body.rotationQuaternion.z = new_rotation._z
      this._body.rotationQuaternion.w = new_rotation._w
    }
  }

  public get name(): string {
    return this._name;
  }

  public set name(new_name: string) {
    this._name = new_name;
  }

  public get health(): number {
    return this._health;
  }

  public set health(new_health: number) {
    if (new_health < 0 || new_health > 100) {
      throw new Error("Player entity health out of bound");
    }
    this._health = new_health;
  }

  public heal(magnitude: number) {
    this._health += magnitude;
    if (this._health > 100) this._health = 100;
  }

  public damage(magnitude: number) {
    this._health -= magnitude;
    if (this._health <= 0) {
      console.log("dead");
      this._health = 100;
    }
  }

  public get exp(): number {
    return this._exp;
  }

  public set exp(new_exp: number) {
    this._exp = new_exp;
  }

  public get id(): string {
    return this._id;
  }

  public delete() {
    if (this._body) {
      this._body.dispose();
    }
    if (this._nametag) {
      this._nametag.dispose();
    }
  }

  protected get scene(): Scene {
    return this._scene;
  }

  public get body(): Mesh {
    return this._body
  }
}
