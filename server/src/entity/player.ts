import { MeshBuilder, Scene, Vector3, Mesh, PhysicsImpostor, SceneLoader, VertexBuffer, Quaternion } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';
import { generateUsername } from "unique-username-generator";
import { Packet, PacketType } from "../packet";
import * as dotenv from 'dotenv'
dotenv.config()

export class Player{

    private _name: string;
    private _health: number;
    private _exp: number;
    private _position: Vector3;
    private _id: string;
    private _body: Mesh;
    private _scene: Scene;

    private player_body_scale = 1.75;

    constructor(
        scene: Scene,
        name?: string|undefined, 
        health?: number|undefined, 
        exp?: number|undefined, 
        position?: Vector3|undefined, 
    ){
        this._name = name || generateUsername();
        this._health = health || 100;
        this._exp = exp || 0;
        this._position = position || new Vector3(0, 0, 0);
        this._id = uuidv4();
        this._scene = scene
        this._loadBody()
    }

    private async _loadBody() {
        let bodies: any = await SceneLoader.ImportMeshAsync(
          "",
          `${process.env["CMS"]}/meshes/`,
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
    
        player_body.position = new Vector3(0, 1, 0)
        //   for (let i = 0 ; i < player_body.material.subMaterials.length; i ++){
        //     player_body.material.subMaterials[i].usePhysicalLightFalloff = false
        //   }
    
        this._body = player_body
    
        this._body.rotationQuaternion = Quaternion.FromEulerAngles(0, 0, 0)
      }

    public get body(): Mesh{
        return this._body
    }

    public get position(): Vector3{
        return this._position;
    }

    public set position(new_position: Vector3){
        this._position = new_position;
    }

    public set rotation(new_rotation: Quaternion){
        if (this._body) {
            this._body.rotationQuaternion!.x = new_rotation._x
            this._body.rotationQuaternion!.y = new_rotation._y
            this._body.rotationQuaternion!.z = new_rotation._z
            this._body.rotationQuaternion!.w = new_rotation._w
        }
    }

    public get rotation(): Quaternion{
        if (this._body) return this._body.rotationQuaternion
        return Quaternion.FromEulerAngles(0, 0, 0)
    }

    public get name(): string{
        return this._name;
    }

    public set name(new_name: string){
        this._name = new_name;
    }

    public get health(): number{
        return this._health;
    }

    public set health(new_health: number){
        if (new_health < 0 || new_health > 100){
            throw new Error("Player entity health out of bound")
        }
        this._health = new_health;
    }

    public get exp(): number{
        return this._exp;
    }

    public set exp(new_exp: number){
        this._exp = new_exp;
    }

    public get id(): string{
        return this._id;
    }

    public serialize(type: PacketType = PacketType.movement, additional_info: any = {}): Packet{
        let info: any = {
            name: this._name,
            health: this._health,
            exp: this._exp, 
            position: this._position, 
            rotation: this.rotation
        }

        for (let key of Object.keys(additional_info)){
            info[key] = additional_info[key]
        }

        let updatePacket: Packet = new Packet(type, [info], this._id)
        return updatePacket
    }

}