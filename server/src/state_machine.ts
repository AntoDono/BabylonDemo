import { World } from "./world"
import { Entities, Old_Entity } from "./entity/entities";
import { Logger } from "./logger";
import { SocketServer } from "./server";
import { Packet, PacketType } from "./packet"
import { Player } from "./entity/player";
import { Vector3 } from "@babylonjs/core";
import { NPC } from "./entity/npc";

const smallest_pos_change: number = 0.001;
const smallest_angle_change: number = 0.001;

class State_machine{

    public players: Map<string, Player> = new Map();
    public entities: Map<string, Entities> = new Map(); 
    public old_entities: Map<string, Old_Entity> = new Map(); 
    private npc: Map<string, NPC> = new Map();

    private logger: Logger = new Logger("STATE_MACHINE");
    private socket_ref: SocketServer;
    private world_ref: World;

    constructor(){
        this.logger = new Logger("STATE_MACHINE")
        this.logger.progress("State machine initiated");
    }

    private ready(){
        this.logger.progress("Checking status of State Machine")
        if (this.socket_ref) this.logger.progress("State Machine has Socket!")
        if (this.world_ref) this.logger.progress("State Machine has World!")
        if (this.socket_ref && this.world_ref) {
            this.logger.pass("State Machine is ready!")
            this.update()
        }
    }

    public setSocket(socket_ref: SocketServer): void{
        this.socket_ref = socket_ref;
        this.ready()
    }

    public setWorld(world_ref: World): void{
        this.world_ref = world_ref;
        this.ready()
    }

    private pass_changes(a: Entities, b: Old_Entity): boolean{
        let pos_change: Vector3 = a.position.subtract(b.position);
        let rot_change: Vector3 = a.angularVelocity.subtract(b.angularVelocity);

        let flag: boolean = true;

        if (pos_change.x <= smallest_pos_change && 
            pos_change.y <= smallest_pos_change && 
            pos_change.z <= smallest_pos_change
        )   flag = false;

        if (rot_change.x <= smallest_angle_change && 
            rot_change.y <= smallest_angle_change &&
            rot_change.z <= smallest_angle_change
        )   flag = false;

        b.update(a)
        this.old_entities.set(b.id, b)

        return flag
    }

    public broadcast_entity(info: boolean = false): void{
        let cnt = 0;
        for (let uid of this.entities.keys()){
            let entity: Entities = this.entities.get(uid);
            let entity_old: Old_Entity = this.old_entities.get(uid)

            let passed: boolean = this.pass_changes(entity, entity_old) // if changes very little dont broadcast
            // if (passed || info || this.npc.get(uid)) {
            if (true) {
                this.socket_ref.broadCast(entity.serialize())
                cnt++;
            }

        }
    }

    private broadcast_player(): void{
        for (let uid of this.players.keys()){
            let player_entity: Player = this.players.get(uid);
            this.socket_ref.broadCast(player_entity.serialize(PacketType.update))
        }
    }

    public update_player(uid: string, player: Player){
        this.players.set(uid, player);
    }

    public update_entity(uid: string, entity: Entities){
        this.entities.set(uid, entity);
    }

    public add_player(uid: string, player: Player){
        this.players.set(uid, player);
    }

    public add_entity(uid: string, entity: Entities, is_npc:boolean = false){
        this.entities.set(uid, entity);
        this.old_entities.set(uid, new Old_Entity(entity))
        if (is_npc) this.npc.set(uid, new NPC(entity, this.world_ref.scene));
    }

    public delete_player(uid: string){
        this.players.delete(uid)
    }

    public delete_entity(uid: string){
        this.entities.delete(uid)
        this.old_entities.delete(uid)
        if (this.npc.get(uid)) this.npc.delete(uid)
    }

    public has_player(uid: string): boolean{
        return this.players.has(uid);
    }

    public has_entity(uid: string): boolean{
        return this.entities.has(uid);
    }

    public update(){
        if (!this.socket_ref) {
            this.logger.error("State Machine does not have socket reference")
            return
        }
        if (!this.world_ref) {
            this.logger.error("State Machine does not have world reference")
            return
        }
        this.broadcast_entity()
        this.broadcast_player()
    }

}

const state_machine = new State_machine()

export { state_machine }