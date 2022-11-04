import { Scene, Engine, Vector3, MeshBuilder, HemisphericLight, ArcRotateCamera, FreeCamera, SceneLoader, TransformNode, vecToLocal, Matrix, Size, StandardMaterial, Color3, KeyboardEventTypes, PointerEventTypes, RayHelper, Material} from 'babylonjs';
import "@babylonjs/loaders/glTF";
import { MainPlayer } from "../entity/mainPlayer"
import { Socket } from "../socket"
import { Packet, PacketType } from '../packet';
import { Player } from '../entity/player';
import { GUI } from '../gui/gui';
import { Hotbar } from '../gui/hotbar';
import { Items } from '../gui/items';

export class World {
    private _engine: Engine;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement | null;
    private _playerCamera: FreeCamera;
    private _entities: any[] = [];
    private _socket: Socket;
    private _player: MainPlayer;
    private _players:  Map<string, Player>;
    private _testMaterial: StandardMaterial;
    private _GUI: GUI
    private _hotbar: Hotbar
    private _debug: bool = true

    constructor(canvas: HTMLCanvasElement | null) {
        this._canvas = canvas;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this._GUI = new GUI(this._scene);
        this._players = new Map<string, Player>;
        this._testMaterial =  new StandardMaterial("_testMaterial", this._scene);
        ;
        this._guiOpen = false;
    }

    public init(): void {
        this._scene.useRightHandedSystem = true;
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        this._playerCamera = new FreeCamera("FreeCamera", new Vector3(0, 0, 0), this._scene);
        var ground = MeshBuilder.CreateGround("ground", { width: 500, height: 500 }, this._scene);
        ground.position = new Vector3(0, 0, 0)
        ground.checkCollisions = true;
        var light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            this._scene
        );
        const box = MeshBuilder.CreateBox("box", {height:2, width:2, depth:2})
        box.position.y=2;
        box.metadata = "box";
        box.checkCollisions = true;
this._activated = false;
this._testMaterial.diffuseColor = new Color3(1, 0, 1);
this._testMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
this._testMaterial.emissiveColor = new Color3(1, .1, 1);
this._testMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);

box.material =  this._testMaterial;
  this._scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERWHEEL:
        this._castRay();
        
        break;
    }
  });
        this._GUI.createHotbar()
        this._hotbar = this._GUI.hotbar
        this._hotbar.add(Items.hammer, 0)
        this._hotbar.add(Items.dagger, 1)
        this._hotbar.add(Items.shovel, 2)
        this._hotbar.current = 1
        console.log(this._hotbar)

        this._scene.executeWhenReady(() => {
            this._socket = new Socket(this);

            this._socket.send(new Packet(PacketType.info, [this._player], undefined),)

            this._engine.runRenderLoop(() => {
                this._scene.render();
                if (this._player) {
                    console.log(this._player.position)
                    this._socket.send(new Packet(PacketType.movement, [{id: this._player.id, name: this._player.name, position: this._player.position, rotation: this._player.rotation }], this._player.id))
                    if (this._debug){
                        document.getElementById("x").innerText = `X: ${this._player.position.x}`
                        document.getElementById("y").innerText = `Y: ${this._player.position.y}`
                        document.getElementById("z").innerText = `Z: ${this._player.position.z}`
                    }
                }
            })

        })

        this.listen()
    }

    private listen() {
        window.onunload = () => {
            this._socket.close(this._player.id)
        }
    }

    private _initClient(name: string, id: string): void {
        this._player = new MainPlayer(
            name, 100, 0, new Vector3(0, 10, 0), new Vector3(0, 0, 0),
            id, this._scene, this._canvas,
            this._playerCamera
        )
        if (this._debug) document.getElementById("name").innerText = `Name: ${this._player.name}`
        if (this._debug) document.getElementById("id").innerText = `UserID: ${this._player.id}`
        console.log("Created Main Player id: " + this._player.id)
    }
    private _castRay(){
        var dray = this._scene.createPickingRay(this._scene.pointerX, this._scene.pointerY, Matrix.Identity(), this._playerCamera);	
        var hit = this._scene.pickWithRay(dray);
        new RayHelper(dray).show(this._scene, new Color3(.3,1,.3));
    
        if (hit.pickedMesh && hit.pickedMesh.metadata == "box"){
            console.log("hit");
            this._testMaterial.diffuseColor = new Color3(1, 1, 0);
            this._guiOpen = true;
        }else{
            this._guiOpen = false;
            console.log("not hit")
        }
    }   
    private _initPlayer(player: Player): void {
        this._players.set(player.id, player)
    }
    public onSocketData(data: Packet): void {
        // console.log(data)
        switch (data?.type) {
            case "Update":
                let playerData = data.payload
                if (!this._players.has(playerData.id) && playerData.id != this._player.id){
                    let newPlayer: Player = new Player(playerData.name, 100, 0, new Vector3(playerData.position.x, playerData.position.y, playerData.position.z), new Vector3(playerData.position.x, playerData.position.y, playerData.position.z), playerData.id, this._scene, {renderBody: true})
                    this._players.set(playerData.id, newPlayer)
                    console.log(`Player doesn't exist, creating a new player with id ${playerData.id}`)
                }else if (playerData.id != this._player.id) {
                    let player: Player = this._players.get(playerData.id)
                    player.position = playerData.position
                    player.rotation = playerData.rotation
                    this._players.set(player.id, player)
                    if (this._debug) document.getElementById("pcount").innerText = `Players online: ${this._players.size}`
                }else if (playerData.id == this._player.id){
                    this._player.position = new Vector3(playerData.position._x, playerData.position._y, playerData.position._z)
                }
                this._playerCamera.computeWorldMatrix();
                break
            case "Mesh":
                console.log("MAKING BOXES")
                let meshdata = data.payload
                var material = new StandardMaterial("box color", this._scene);
                material.alpha = 1;
                material.diffuseColor = new Color3(1.0, 0.2, 0.7);
                for (let mesh of meshdata){
                    console.log(mesh)
                    let box = MeshBuilder.CreateBox(mesh.name, { size: 2, width: 2, height: 2}, this._scene)
                    box.position = mesh.position
                    box.material = material; // <--
                    this._entities.push(box)
                }
                break
            case "Info":
                let playerInfo: any = data?.payload[0].player;
                console.log(playerInfo)
                if (this._player === null || this._player?.id === playerInfo.id) this._initClient(playerInfo._name, playerInfo._id)
                else // init player
                break
            case "Close":
                let player: Player = this._players.get(data.payload[0].id)
                if (player) player.delete()
                this._players.delete(data.payload[0].id)
                break
            default:
                // throw some error
                break
        }
    }

}
