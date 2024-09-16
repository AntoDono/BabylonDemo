import { Scene, Engine, NullEngine, CannonJSPlugin, Vector3, VertexBuffer, ArcRotateCamera, MeshBuilder, Mesh, PhysicsImpostor, GroundMesh, SceneLoader, OimoJSPlugin } from 'babylonjs';
import { Logger } from './logger';
import * as cannon from "cannon-es";
import { Generation } from './generation';
import { state_machine } from "./state_machine"
import { createEntity, Entities } from './entity/entities';
import * as OIMO from "oimo"

// required imports
import 'babylonjs-loaders';

// required imports
import xhr2 from 'xhr2'

// @ts-ignore
global.XMLHttpRequest = xhr2.XMLHttpRequest

interface worldSize {
    top: Vector3,
    bottom: Vector3
}

export class World{
    private _engine: Engine;
    private _scene: Scene;
    private _tick_time: number = 5000; // in ms
    private _ticks_elapsed: number = 0;
    private _ground: GroundMesh;
    private logger: Logger = new Logger('World');
    private worldSize: worldSize = { top: new Vector3(5000, 10000, 5000), bottom: new Vector3(-5000, 0, -5000)};
    public _generator: Generation
    public isday: boolean = true;
    public alpha_time: number = 0;
    private _sheeps: number = 0;

    constructor(sheeps: number){
        this._engine = new NullEngine();
        this._scene = new Scene(this._engine);
        this._scene.useRightHandedSystem = true;

        this._generator = new Generation(this, this._scene)
        this._sheeps = sheeps
        // console.log(this._ground.position)
    }

    public get scene(): Scene{
        return this._scene;
    }

    private get _get_tick(): number{
        let ticks = Math.round(this._ticks_elapsed/this._tick_time * 1000);
        this._ticks_elapsed = 0;
        return ticks;
    }

    public validateEntityPosition(entityPosition: Vector3): Vector3{
        if (
            (entityPosition.x < this.worldSize.bottom.x || entityPosition.x > this.worldSize.top.x) ||
            (entityPosition.y < this.worldSize.bottom.y || entityPosition.y > this.worldSize.top.y) ||
            (entityPosition.z < this.worldSize.bottom.z || entityPosition.z > this.worldSize.top.z) 
        ) {
            console.log("EXCEEDED LIMITS: " + entityPosition + " compared to " +  this.worldSize.bottom + " and " + this.worldSize.top)
            return new Vector3(0, 10, 0);
        }
        else return entityPosition;
    }

    public async init(): void{
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        var camera:ArcRotateCamera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), this._scene); 
        this._scene.enablePhysics(new Vector3(0, -9.81, 0), new OimoJSPlugin(true, 10, OIMO));

        
        this._scene.executeWhenReady(()=>{

            this.logger.progress("Scene is ready, running server side simulation");

            this._scene.beforeRender = () => {

                let deltaTime: number = this._scene.getEngine().getDeltaTime();
    
                this.alpha_time += (0.05 * deltaTime) / 1000;

                this.alpha_time = this.alpha_time % (2 * Math.PI); // keeps alpha always between 0 - 2P
    
                if (Math.cos(this.alpha_time) > 0 && !this.isday){
                    this.isday = true
                }else if (Math.cos(this.alpha_time) < 0 && this.isday){
                    this.isday = false
                }
            }

            this._engine.runRenderLoop(()=>{
                this._scene.render();
                this._ticks_elapsed++;
                state_machine.update();

                // for (let uid of state_machine.entities.keys()){
                //     let entity: Entities = state_machine.entities.get(uid);
        
                //     console.log(entity.object.rotationQuaternion)
                // }
            })

        })

        this.logger.interval_logger(this._tick_time, ()=>{
            this.logger.progress(`Avg Server tick (${this._tick_time} ms): ${this._get_tick}`)
        })

        state_machine.setWorld(this)

        this._ground = MeshBuilder.CreateGround("ground", {width: 10000, height: 10000}, this._scene);
        this._ground.position = new Vector3(0, 0, 0)
        this._ground.physicsImpostor = new PhysicsImpostor(this._ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)

        // this._generator.RANDOMIZE(this._generator.GENERATE.Cylinder(new Vector3(0, 0, 0)), 100, 100)
        // this._generator.RANDOMIZE(await this._generator.GENERATE.Tree2(new Vector3(0, 0, 0)),1, 1)
        // this._generator.RANDOMIZE(this._generator.GENERATE.Box(new Vector3(0, 0, 0)), 100, 1000)
        // this._generator.RANDOMIZE(await this._generator.GENERATE.House(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 100, 1000)
        // this._generator.RANDOMIZE(await this._generator.GENERATE.Slope(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 1, 10)
        
        /*BASIC WORLD */
        this._generator.RANDOMIZE(await this._generator.GENERATE.Tree1(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 50, 1000)
        this._generator.RANDOMIZE(await this._generator.GENERATE.House(new Vector3(100, 0, 10), new Vector3(0, 0, 0)), 50, 1000)
        this._generator.RANDOMIZE(await this._generator.GENERATE.House2(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 50, 1000)
        this._generator.RANDOMIZE(await this._generator.GENERATE.Crate(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 1, 100)
        this._generator.RANDOMIZE(await this._generator.GENERATE.Sheep(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), this._sheeps, 500)
        this._generator.RANDOMIZE(await this._generator.GENERATE.Fountain(new Vector3(50, 0, 50), new Vector3(0, 0, 0)), 0, 0)

        /* MEDIUM WORLD */
        // this._generator.RANDOMIZE(await this._generator.GENERATE.Tree1(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 50, 500)
        // this._generator.RANDOMIZE(await this._generator.GENERATE.House(new Vector3(100, 0, 10), new Vector3(0, 0, 0)), 50, 500)
        // this._generator.RANDOMIZE(await this._generator.GENERATE.Sheep(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 50, 500)

        /* SMALL WORLD */
    //     this._generator.RANDOMIZE(await this._generator.GENERATE.Tree1(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 50, 1000)
    //     this._generator.RANDOMIZE(await this._generator.GENERATE.House(new Vector3(100, 0, 10), new Vector3(0, 0, 0)), 5, 1000)
    //     this._generator.RANDOMIZE(await this._generator.GENERATE.House2(new Vector3(100, 0, 10), new Vector3(0, 0, 0)), 2, 1000)
    //     this._generator.RANDOMIZE(await this._generator.GENERATE.Sheep(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 5, 1000)
    //     this._generator.RANDOMIZE(await this._generator.GENERATE.Fountain(new Vector3(50, 0, 0), new Vector3(0, 0, 0)), 0, 0)
    //     this._generator.RANDOMIZE(await this._generator.GENERATE.Crate(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 100, 1000)

    //     this._generator.RANDOMIZE(await this._generator.GENERATE.Sheep(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 10, 100)
    }

    
}