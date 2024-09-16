import type { World } from "./world/world";
import { Packet, PacketType } from "./packet";

export class Socket {
  private url: string = "ws://localhost:2000";
  private server: any;
  private status: boolean = false;
  private worldReference: World;
  private env: any;

  constructor(world: World, env: any) {
    this.worldReference = world;
    this.env = env
    this.url = this.env.SOCKET_ADDR
  }
  
  private connect(): Promise<WebSocket>{
    return new Promise((res, rej)=>{
      let server = new WebSocket(this.url, "tcp");
      server.onopen = ()=>{
        res(server)
      }
      server.onerror = (err)=>{
        rej(err)
      }
    })
  }

  public async init(): Promise<void> {
    this.server = await this.connect()
    this.send(new Packet(PacketType.player_creation, []))
    this.listen()
    this.status = true
  }

  private listen() {
    this.server.onmessage = (event: any) => {
      const msg = JSON.parse(event.data);
      this.worldReference.onSocketData(msg);
    };
  }

  public send(packet: Packet) {
    if (this.status === true) {
      this.server.send(JSON.stringify(packet));
    } else {
      setTimeout(() => this.send(packet), 50);
    }
  }

  public close(uid: string) {
    this.send(new Packet(PacketType.close, [{ id: uid, delete: true }], uid));
    this.server.close(uid);
  }
}
