import { World } from "./world"
import { Entities } from "./entity/entities";
import { Logger } from "./logger";
import { SocketServer } from "./server";
import { Packet, PacketType } from "./packet"
import { Player } from "./entity/player";

class State_machine{

    public players: Map<string, Player> = new Map();
    public entities: Map<string, Entities> = new Map(); 

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

    private broadcast_entity(): void{
        for (let uid of this.entities.keys()){
            let entity: Entities = this.entities.get(uid);
            let updatePacket: Packet = new Packet(PacketType.mesh, [
                {
                    name: entity.name,
                    metadata: entity.metadata,
                    position: entity.position, 
                    linearVelocity: entity.object.physicsImpostor.getLinearVelocity(), 
                    angularVelocity: entity.object.physicsImpostor.getAngularVelocity()
                }
            ], uid)
            this.socket_ref.broadCast(updatePacket)
        }
    }

    private broadcast_player(): void{
        for (let uid of this.players.keys()){
            let player_entity: Player = this.players.get(uid);
            let updatePacket: Packet = new Packet(PacketType.update, [
                {
                    position: player_entity.position, 
                    // rotaton: player_entity.rotation
                    // linearVelocity: player_entity.object.physicsImpostor.getLinearVelocity(), 
                    // angularVelocity: player_entity.object.physicsImpostor.getAngularVelocity()
                }
            ], uid)
            this.socket_ref.broadCast(updatePacket)
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

    public add_entity(uid: string, entity: Entities){
        this.entities.set(uid, entity);
    }

    public delete_player(uid: string){
        this.players.delete(uid)
    }

    public delete_entity(uid: string){
        this.entities.delete(uid)
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