import { Scene, Vector3 } from "babylonjs";
import { Entities } from "./entities"
import { Logger } from "../logger";

const maxX = 5000
const minX = 5;

const maxZ = 5000;
const minZ = 5;

export class NPC{

    private entity: Entities;
    private _scene: Scene;

    private _logger: Logger = new Logger("NPC")

    constructor(entity: Entities, scene: Scene){
        this.entity = entity
        this._scene = scene
        this._logger.pass("Created NPC")
        this.wander()
    }

    private getRandomDestination(): Vector3{
        let x: number = Math.random() * (maxX - minX) + minX;
        let z: number = Math.random() * (maxZ - minZ) + minZ;
        return new Vector3(x, 0, z)
    }

    private wander():void{ 
        let destination: Vector3 = this.getRandomDestination()
        let direction: Vector3 = destination.subtract(this.entity.position).normalize()
        let distance: number = this.entity.position.subtract(destination).length();

        this.entity.object.lookAt(destination)
        // walkanimation.start()

        let random_interval:number = Math.random() * 1000

        // this._scene.registerBeforeRender(()=>{
        //     if (this.entity.position.subtract(destination).length() > 0.1){
        //         this.entity.object.moveWithCollisions(direction.scale(1))
        //         // this._logger.log(this.entity.position)
        //     }else{
        //         // setTimeout(this.wander, random_interval)
        //     }
        // })
    }

}