import { Vector3 } from "babylonjs"

export class Entities{

    private _position: Vector3;
    private _name: string;
    private _id: string;
    private _object: any;

    constructor(name: string, id: string, position: Vector3, object: any | null){
        this._name = name;
        this._position = position;
        this._id = id;
        if (object) {
            this._object = object;
            this._object.position = this._position;
        }
    }

    public get position(): Vector3{
        return this._position;
    }

    public set position(new_position: Vector3){
        this._position = new_position;
        if (this._object.position) this._object.position = this._position
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

}