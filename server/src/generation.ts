import { MeshBuilder, StandardMaterial, Color3, Scene, Mesh, PhysicsImpostor, Vector2, Vector3, SceneLoader, VertexBuffer, Matrix, Quaternion } from "babylonjs"
import { World } from "./world"
import { state_machine } from "./state_machine"
import { Entities, createEntity } from "./entity/entities"
import { Vec3 } from "cannon-es"
import { Logger } from "./logger"

import * as dotenv from 'dotenv'
dotenv.config()


// required imports
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

// required imports
import xhr2 from 'xhr2'

// @ts-ignore
global.XMLHttpRequest = xhr2.XMLHttpRequest


export class Generation {
  private _world: World
  private _scene: Scene
  private logger: Logger
  
  constructor(world: World, scene: Scene) {
    this._world = world
    this._scene = scene
    this.logger = new Logger("Generation")
  }

  private async add_custom_mesh(
    mass: number = 0, restitution: number = 0, y_pos: number, position: Vector3, rotation: Vector3, name: string, 
    metadata: string, mesh_file_name: string, scaling: Vector3, is_npc: boolean = false
  ): Promise<Entities>{
    let bodies: any = await SceneLoader.ImportMeshAsync(
      "",
      `${process.env["CMS"]}/meshes/`,
      mesh_file_name,
      this._scene
    );

    let meshes: Mesh[] = [];
    bodies.meshes.forEach((m: any) => {
      if (!m.getVerticesData(VertexBuffer.PositionKind)) {
        // ignore and dont add
      } else {
        m.scaling = scaling;
        m.checkCollisions = true;
        meshes.push(m);
      }
    });

    let parent: any = Mesh.MergeMeshes(
      meshes,
      true,
      false,
      undefined,
      false,
      true
    );
 
    parent.metadata = metadata;
    parent.name = name

    parent.position = position
    parent.position.y = y_pos
    
    let entity: Entities = createEntity(this._scene, name, position, parent, PhysicsImpostor.MeshImpostor, mass, restitution)
    entity.rotation = rotation
    
    state_machine.add_entity(entity.id, entity, is_npc)

    return entity
  }

  public GENERATE = {
    Cylinder: (position: Vector3, rotation: Vector3, name?: string): Entities => {
      let item = MeshBuilder.CreateCylinder(`${name ?? "Cylinder"}-${Math.random()*100000}` ?? `Cylinder-${Math.random()*100000}`, { height: 5, diameter: 3 }, this._scene);
      item.position = position
      item.metadata = "Cylinder"
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;

      let entity = createEntity(this._scene, "generate_cylinder", item.position, item, PhysicsImpostor.CylinderImpostor, 90, 1)
      state_machine.add_entity(entity.id, entity)

      return entity
    }, 
    Box: (position: Vector3, rotation: Vector3, name?: string): Entities => {
      let item = MeshBuilder.CreateBox(`${name ?? "Box"}-${Math.random()*100000}` ?? `Box-${Math.random()*100000}`, { size: 2, height: 2, width: 2}, this._scene)
      item.position = position
      item.metadata = "Box"
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;
      let entity = createEntity(this._scene, "generate_box", item.position, item, PhysicsImpostor.BoxImpostor, 90, 1)
      state_machine.add_entity(entity.id, entity)

      return entity
    },
    Tree1: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "Tree1", "Tree1",
        "tree1.glb", new Vector3(2.5, 2.5, 2.5)
      )
    },
    Tree2: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "Tree2", "Tree2",
        "tree2.glb", new Vector3(2.5, 2.5, 2.5)
      )
    },
    House: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "House", "House",
        "house.glb", new Vector3(4, 4, 4)
      )
    },
    House2: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "House2", "House2",
        "house2.glb", new Vector3(2, 2, 2)
      )
    },
    Sheep: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        100, 0, 0, position, rotation, "Sheep", "Sheep",
        "sheep.glb", new Vector3(1, 1, 1), true
      )
    },
    Slope: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "Slope", "Slope",
        "slope.glb", new Vector3(4, 4, 4)
      )
    },
    Fountain: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "Fountain", "Fountain",
        "fountain.glb", new Vector3(3, 3, 3)
      )
    },
    Crate: async (position: Vector3, rotation: Vector3, name?: string): Promise<Entities> => {
      return this.add_custom_mesh(
        0, 0, 0, position, rotation, "Crate", "Crate",
        "crate.glb", new Vector3(3, 3, 3)
      )
    },
  }

  public async RANDOMIZE(item: Entities, count: number = 5, squareRange: number = 20) {
    
    let items: Entities[] = []

    for (let i = 1; i < count; i++) {
      let pos = new Vector3((Math.random()*squareRange) - (squareRange/2), 10, (Math.random()*squareRange) - (squareRange/2))
      let rot = new Vector3(0, Math.random() * 2 * Math.PI, 0)
      let newItem: Entities = await this.GENERATE[item.metadata as "Cylinder" | "Box" | "Tree1" | "Tree2" | "House" | "House2" | "Sheep" | "Slope" | "Fountain" | "Crate"](pos, rot)
      items.push(newItem)
    }

    return items
  }
}