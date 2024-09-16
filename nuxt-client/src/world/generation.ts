import { World } from "./world";
import {
  MeshBuilder,
  StandardMaterial,
  Color3,
  Scene,
  Mesh,
  SceneLoader,
  Vector3,
  PhysicsImpostor,
  VertexBuffer,
  Sound,
  Texture,
  AbstractMesh
} from "@babylonjs/core";
import { Entities, createEntity } from "../entity/entities";
import { state_machine } from "../state_machine";

class SoundLoader{
  private _sounds: Map<string, Sound> = new Map()

  public add_sound(name: string, sound: Sound){
    this._sounds.set(name, sound)
  }

  public get_sound(name: string): Sound | undefined{
    let sound: Sound = this._sounds.get(name)?.clone()
    sound.play()
    return sound
  }

}

class MeshLoader{
  private _meshes: Map<string, Mesh> = new Map()
  private env: any;

  constructor(env: any){
    this.env = env
  }

  public async add_mesh(name: string, mass: number, metadata: string, mesh_file_name: string, scaling: Vector3){
    let bodies: any = await SceneLoader.ImportMeshAsync(
      "",
      `${this.env["CMS"]}/meshes/`,
      mesh_file_name,
    );

    let meshes: Mesh[] = [];
    bodies.meshes.forEach((m: any) => {
      if (!m.getVerticesData(VertexBuffer.PositionKind)) {
        // dont add this mesh
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

    if (parent.material){
       for (let i = 0; i < parent.material.subMaterials.length; i++) {
        parent.material.subMaterials[i].usePhysicalLightFalloff = false;
      } 
    }

    if (mass === 0) {
      parent.freezeWorldMatrix()
      parent.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
    }
    parent.metadata = metadata;
    parent.receiveShadows = true;
    parent.name = name
    parent.position = new Vector3(0, -1000, 0)
    this._meshes.set(name, parent)
  }

  public get_meshes(name: string): Mesh | undefined{
    let mesh: Mesh = this._meshes.get(name)?.clone(name)
    return mesh
  }

}


export class Generation {
  private _world: World;
  private _scene: Scene;
  private env: any;
  private soundLoader;
  private meshLoader;

  constructor(world: World, scene: Scene, env: any) {
    this._world = world;
    this._scene = scene;
    this.env = env;
  

    this.soundLoader = new SoundLoader()

    // add sounds
    this.soundLoader.add_sound(
      "whalen",
      new Sound("Whalen", `${this.env["CMS"]}/audio/whalen.wav`, this._scene, null, { loop: true, autoplay: false, volume: 0.2, maxDistance: 100 })
    )

    this.soundLoader.add_sound(
      "rustling",
      new Sound("Rustling", `${this.env["CMS"]}/audio/rustling.mp3`, this._scene, null, { loop: true, autoplay: false, volume: 0.2, maxDistance: 100 })
    )

    this.meshLoader = new MeshLoader(this.env)

    this.meshLoader.add_mesh("Tree1", 0, "Tree1", "tree1.glb", new Vector3(2.5, 2.5, 2.5))
    this.meshLoader.add_mesh("Tree2", 0, "Tree1", "tree2.glb", new Vector3(2.5, 2.5, 2.5))
    this.meshLoader.add_mesh("House", 0, "House", "house.glb", new Vector3(4, 4, 4))
    this.meshLoader.add_mesh("House2", 0, "Tree1", "house2.glb", new Vector3(2, 2, 2))
    this.meshLoader.add_mesh("Sheep", 0, "Sheep", "sheep.glb", new Vector3(1, 1, 1))
    this.meshLoader.add_mesh("Slope", 0, "Slope", "slope.glb", new Vector3(4, 4, 4))
    this.meshLoader.add_mesh("Fountain", 0, "Fountain", "fountain.glb", new Vector3(3, 3, 3))
    this.meshLoader.add_mesh("Crate", 0, "Crate", "crate.glb", new Vector3(3, 3, 3))

  }

  private async add_custom_mesh(
    uid: string, mesh: any, loaded_mesh: Mesh, y_pos: number, mass: number, restitution: number, noise: Sound | undefined = undefined
  ): Promise<Mesh>{
    
    loaded_mesh.position = new Vector3(mesh.position._x, y_pos, mesh.position._z);
    this._scene.addMesh(loaded_mesh)
    
    let entity: Entities = createEntity(
      this._scene,
      uid,
      mesh.name,
      mesh.position,
      loaded_mesh,
      PhysicsImpostor.MeshImpostor,
      mass,
      restitution
    );
    entity.update(
      mesh.linearVelocity,
      mesh.angularVelocity,
      mesh.position,
      mesh.rotation
    );
    state_machine.add_entity(uid, entity);

    if (noise){
      noise.attachToMesh(loaded_mesh);
      loaded_mesh.attachedSound = noise
    }

    return loaded_mesh;
  }

  public GENERATE = {
    Cylinder: (mesh: any, uid: string): Mesh => {
      let item = MeshBuilder.CreateCylinder(mesh.name, {
        height: 5,
        diameter: 3,
      });
      item.position = mesh.position;
      item.metadata = mesh.metadata;
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;

      return item;
    },
    Box: (mesh: any, uid: string): Mesh => {
      var material = new StandardMaterial("box_texture", this._scene);
      material.diffuseTexture = new Texture(
        `${this.env["CMS"]}/textures/whalen/whalen.jpg`,
        this._scene
      );
      let box = MeshBuilder.CreateBox(
        mesh.name,
        { size: 3, width: 3, height: 3 },
        this._scene
      );
      box.position = mesh.position;
      box.metadata = mesh.metadata;
      box.material = material;

      return box;
    },
    Tree1: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("Tree1"), 0, 0, 0, this.soundLoader.get_sound("rustling"))
    },
    Tree2: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("Tree2"), 0, 0, 0, this.soundLoader.get_sound("rustling"))
    },
    House: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("House"), 0, 0, 0)
    },
    House2: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("House2"), 0, 0, 0)
    },
    Sheep: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("Sheep"), 0, 0, 0, this.soundLoader.get_sound("whalen"))
    },
    Slope: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("Slope"), 0, 0, 0)
    },
    Fountain: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("Fountain"), 0, 0, 0)
    },
    Crate: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(uid, mesh, this.meshLoader.get_meshes("Crate"), 0, 0, 0)
    },
  };

}
