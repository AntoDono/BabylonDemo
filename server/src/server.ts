import { Server } from 'ws'
import { World } from './world'
import { Player } from './entity/player'
import { CubeMapToSphericalPolynomialTools, Vector3 } from 'babylonjs'
import { Router } from './router'
import { Packet, PacketType } from './packet'
import { Logger } from './logger'
import { state_machine } from './state_machine'

export class SocketServer {
  static readonly PORT: number = 2000
  private server: Server
  private world: World
  private logger: Logger
  private players: Map<any, any> // uid, players
  private client_to_uid: Map<any, any> //client to id
  private _sheeps: number = 10

  constructor() {
    this.players = new Map()
    this.client_to_uid = new Map()
    this.world = new World(this._sheeps)
    this.logger = new Logger('Socket')
    this.server = new Server({ port: SocketServer.PORT })

    this.init()
    this.listen()

    state_machine.setSocket(this)
  }

  private init() {
    this.world.init()
  }

  public setPlayer(uid: string | undefined, player: Player) {
    this.players.set(uid, player)
  }

  private listen() {
    this.logger.progress('Start listening on port: ' + SocketServer.PORT)

    this.server.on('connection', (client: any) => {

      this.logger.log('Client established connection')

      // basic starter functiosn
      client.on('message', (message: string) => {
        let msg: Packet = JSON.parse(message)

        let player: Player = this.players.get(msg.uid)

        switch (msg.type) {
          case "Movement":
            // this.logger.log(`Received Movement from client ${msg.payload[0].id}`)
            // player.position = new Vector3(msg.payload.position.x, msg.payload.position.y, msg.payload.position.z)
            // this.send(client, new Packet(PacketType.update, [player]))
            if (player !== null) {
              player.position = this.world.validateEntityPosition(new Vector3(msg.payload[0].position._x, msg.payload[0].position._y, msg.payload[0].position._z))
              player.rotation = msg.payload[0].rotation
              state_machine.update_player(msg.uid, player)
            }
            break

          case "Close":
            this.broadCast(new Packet(PacketType.close, [{ id: msg.uid, delete: true }]))
            break
          case "Interaction":
            this.logger.log("Received interaction")
            this.broadCast(new Packet(PacketType.interaction, msg.payload[0]))
            break
          case "Chat":
            this.logger.log("Received chat message")
            this.broadCast(new Packet(PacketType.chat, msg.payload[0]))
            break;
          case "ping":
            this.logger.log("Received Ping from client. Pong!")
            this.send(client, new Packet(PacketType.info, ['Pong!']))
            break
          case "PlayerCreation":
            this.logger.log("Received Player Creation")
            if (!this.players.has(client)) {
              let player = new Player(this.world.scene)
              this.players.set(player.id, player)
              state_machine.add_player(player.id, player)
              this.send(client, player.serialize(PacketType.player_creation, { players: this.players.size, isday: this.world.isday, alpha_time: this.world.alpha_time, total_mesh: state_machine.entities.size, sheeps: this._sheeps }))
              state_machine.broadcast_entity(true)
              this.client_to_uid.set(client, player.id)
            }
            break
          case "RequestMesh":
            let mesh_id = msg.uid
            this.logger.warn("Need mesh confirm")
            this.send(client, state_machine.entities.get(mesh_id)?.serialize())
            break
          default:
            this.logger.error(`Unknown socket message from client (${msg.type})`)
            break
        }
      })

      client.on('close', () => {
        this.logger.log('Client connection closed')
        state_machine.delete_player(this.client_to_uid.get(client))
        this.client_to_uid.delete(client)
        // this.world.removePlayer(id)
        // close with router
      })

      client.on('error', () => {
        this.logger.error('Client connection threw an error')
      })
    })
  }

  private send(client: any, packet: Packet) {
    client.send(
      JSON.stringify(packet)
    )
  }

  public broadCast(packet: Packet) {
    this.server.clients.forEach((client)=>{
      if (this.client_to_uid.get(client) !== null) {
        this.send(client, packet)
      }
    })
  }
}