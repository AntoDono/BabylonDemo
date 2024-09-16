import { Scene, Mesh, PhysicsImpostor, Vector3, Quaternion } from "@babylonjs/core"

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

    private _position: Vector3;
    private _name: string;
    private _id: string;
    private _object: any;
    public collide: boolean = false;

    constructor(name: string, id: string, position: Vector3, object: any | null){
        this._name = name;
        this._position = position;
        this._id = id;
        if (object) {
            this._object = object;
            this._object.position = this._position;

            // this._object.onCollideObservable()

            // if (this._object.physicsImpostor) {
            //     this._object.physicsImpostor.onCollideEvent = (e)=>{
            //         this.collide = true;
            //         console.log("Started")
            //     }

            //     this._object.physicsImpostor.onCollideEventEnd = (e)=>{
            //         this.collide = false;
            //         console.log("Ended")
            //     }
            // }
        }
    }

    public get angularVelocity(): Vector3{
        return this._object.physicsImpostor.getAngularVelocity();
    }

    public get linearVelocity(): Vector3{
        return this._object.physicsImpostor.getLinearVelocity();
    }

    public get position(): Vector3{
        return this._object.position;
    }

    public get metadata(): string{
        return this._object.metadata
    }

    public set position(new_position: Vector3){
        if (this._object) this._object.position = new Vector3(new_position._x, new_position._y, new_position._z);
        this._position = this._object.position
    }

    public get rotationQuaternion(): Quaternion {
        return this._object.rotationQuaternion;
    }

    public get rotation(): Vector3 {
        return this._object.rotation
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

    public set object(new_object: any){
        this._object = new_object
    }

    public update(linearVelocity: Vector3, angularVelocity: Vector3, position: Vector3, rotation: Vector3){
        this._object.physicsImpostor.setAngularVelocity(new Vector3(angularVelocity._x, angularVelocity._y, angularVelocity._z));
        this._object.physicsImpostor.setLinearVelocity(new Vector3(linearVelocity._x, linearVelocity._y, linearVelocity._z));
        this._object.position = position;
        this.rotation = rotation
    }

}

export function createEntity(scene: Scene, uid: string, name: string, position: Vector3, mesh: Mesh, imposterType: number, mass: number, restitution: number): Entities{
    let entityImposter: PhysicsImpostor = new PhysicsImpostor(mesh, imposterType, { mass: mass, restitution: restitution}, scene);
    mesh.physicsImpostor = entityImposter
    mesh.position = position
    return new Entities(name, uid, position, mesh)
}