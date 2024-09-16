import { Quaternion, Vector3, Mesh, MeshBuilder, PhysicsImpostor, Scene } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';
import { Packet, PacketType } from "../packet";

export class Old_Entity{

    public position: Vector3;
    public angularVelocity: Vector3;
    public linearVelocity: Vector3;
    private _id: string;

    constructor(entity: Entities){
        this.position = entity.position;
        this.angularVelocity = entity.angularVelocity;
        this.linearVelocity = entity.linearVelocity
        this._id = entity.id;
    }

    public update(entity: Entities): void{
        this.position = entity.position;
        this.angularVelocity = entity.angularVelocity;
        this.linearVelocity = entity.linearVelocity
    }

    public get id(): string{
        return this._id
    }

}

export class Entities{

    private _name: string;
    private _object: any;
    private _id: string;

    constructor(name: string, position: Vector3, object: Mesh){
        this._name = name;
        this._id = `M-${uuidv4()}`
        this._object = object;
        this._object.position = position;
    }

    public get metadata(): string{
        
        return this._object.metadata
    }

    public get position(): Vector3{
        return this._object.position;
    }

    public get angularVelocity(): Vector3{
        return this._object.physicsImpostor.getAngularVelocity();
    }

    public get linearVelocity(): Vector3{
        return this._object.physicsImpostor.getLinearVelocity();
    }

    public get rotationQuaternion(): Quaternion {
        return this._object.rotationQuaternion;
    }

    public get rotation(): Vector3 {
        return this._object.rotation;
    }
    
    public set rotationQuaternion(new_rotation: Quaternion) {
        if (this._object) {
            this._object.rotationQuaternion.x = new_rotation._x
            this._object.rotationQuaternion.y = new_rotation._y
            this._object.rotationQuaternion.z = new_rotation._z
            this._object.rotationQuaternion.w = new_rotation._w
        }
    } 

    public set rotation(new_rotation: Vector3) {
        if (this._object) {
            this._object.rotation = new Vector3(new_rotation._x, new_rotation._y, new_rotation._z)
        }
    } 

    public set position(new_position: Vector3){
        if (this._object.position) this._object.position = new_position
    }

    public get name(): string{
        return this._name;
    }

    public set name(new_name: string){
        this._name = new_name;
    }

    public get id(): string{
        return this._id;
    }

    public get object(): any{
        return this._object
    }

    public update(linearVelocity: Vector3, angularVelocity: Vector3, position: Vector3){
        this._object.physicsImpostor.setAngularVelocity(new Vector3(angularVelocity._x, angularVelocity._y, angularVelocity._z));
        this._object.physicsImpostor.setLinearVelocity(new Vector3(linearVelocity._x, linearVelocity._y, linearVelocity._z));
        this._object.position = position;
    }

    public serialize(): Packet{
        let updatePacket: Packet = new Packet(PacketType.mesh, [
            {
                name: this._object.name,
                metadata: this.metadata,
                position: this._object.position,
                rotationQuaternion: this.rotationQuaternion, // for some reason, this is going to be null as rotation property interferes with quaternion
                rotation: this._object.rotation,
                linearVelocity: this._object.physicsImpostor.getLinearVelocity(), 
                angularVelocity: this._object.physicsImpostor.getAngularVelocity(),
                boundingBox: this._object.getBoundingInfo()
            }
        ], this._id)
        return updatePacket
    }

}

export function createEntity(scene: Scene, name: string, position: Vector3, mesh: Mesh, imposterType: number | null, mass: number, restitution: number): Entities{
    if (imposterType != null){
        let entityImposter: PhysicsImpostor = new PhysicsImpostor(mesh, imposterType, { mass: mass, restitution: restitution }, scene);
        mesh.physicsImpostor = entityImposter
    }
    let entity: Entities = new Entities(name, position, mesh)
    return entity
}