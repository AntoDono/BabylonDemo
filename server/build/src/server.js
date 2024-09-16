"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
var ws_1 = require("ws");
var world_1 = require("./world");
var player_1 = require("./entity/player");
var babylonjs_1 = require("babylonjs");
var packet_1 = require("./packet");
var logger_1 = require("./logger");
var state_machine_1 = require("./state_machine");
var SocketServer = /** @class */ (function () {
    function SocketServer() {
        this._sheeps = 10;
        this.players = new Map();
        this.client_to_uid = new Map();
        this.world = new world_1.World(this._sheeps);
        this.logger = new logger_1.Logger('Socket');
        this.server = new ws_1.Server({ port: SocketServer.PORT });
        this.init();
        this.listen();
        state_machine_1.state_machine.setSocket(this);
    }
    SocketServer.prototype.init = function () {
        this.world.init();
    };
    SocketServer.prototype.setPlayer = function (uid, player) {
        this.players.set(uid, player);
    };
    SocketServer.prototype.listen = function () {
        var _this = this;
        this.logger.progress('Start listening on port: ' + SocketServer.PORT);
        this.server.on('connection', function (client) {
            _this.logger.log('Client established connection');
            // basic starter functiosn
            client.on('message', function (message) {
                var _a;
                var msg = JSON.parse(message);
                var player = _this.players.get(msg.uid);
                switch (msg.type) {
                    case "Movement":
                        // this.logger.log(`Received Movement from client ${msg.payload[0].id}`)
                        // player.position = new Vector3(msg.payload.position.x, msg.payload.position.y, msg.payload.position.z)
                        // this.send(client, new Packet(PacketType.update, [player]))
                        if (player !== null) {
                            player.position = _this.world.validateEntityPosition(new babylonjs_1.Vector3(msg.payload[0].position._x, msg.payload[0].position._y, msg.payload[0].position._z));
                            player.rotation = msg.payload[0].rotation;
                            state_machine_1.state_machine.update_player(msg.uid, player);
                        }
                        break;
                    case "Close":
                        _this.broadCast(new packet_1.Packet(packet_1.PacketType.close, [{ id: msg.uid, delete: true }]));
                        break;
                    case "Interaction":
                        _this.logger.log("Received interaction");
                        _this.broadCast(new packet_1.Packet(packet_1.PacketType.interaction, msg.payload[0]));
                        break;
                    case "Chat":
                        _this.logger.log("Received chat message");
                        _this.broadCast(new packet_1.Packet(packet_1.PacketType.chat, msg.payload[0]));
                        break;
                    case "ping":
                        _this.logger.log("Received Ping from client. Pong!");
                        _this.send(client, new packet_1.Packet(packet_1.PacketType.info, ['Pong!']));
                        break;
                    case "PlayerCreation":
                        _this.logger.log("Received Player Creation");
                        if (!_this.players.has(client)) {
                            var player_2 = new player_1.Player(_this.world.scene);
                            _this.players.set(player_2.id, player_2);
                            state_machine_1.state_machine.add_player(player_2.id, player_2);
                            _this.send(client, player_2.serialize(packet_1.PacketType.player_creation, { players: _this.players.size, isday: _this.world.isday, alpha_time: _this.world.alpha_time, total_mesh: state_machine_1.state_machine.entities.size, sheeps: _this._sheeps }));
                            state_machine_1.state_machine.broadcast_entity(true);
                            _this.client_to_uid.set(client, player_2.id);
                        }
                        break;
                    case "RequestMesh":
                        var mesh_id = msg.uid;
                        _this.logger.warn("Need mesh confirm");
                        _this.send(client, (_a = state_machine_1.state_machine.entities.get(mesh_id)) === null || _a === void 0 ? void 0 : _a.serialize());
                        break;
                    default:
                        _this.logger.error("Unknown socket message from client (".concat(msg.type, ")"));
                        break;
                }
            });
            client.on('close', function () {
                _this.logger.log('Client connection closed');
                state_machine_1.state_machine.delete_player(_this.client_to_uid.get(client));
                _this.client_to_uid.delete(client);
                // this.world.removePlayer(id)
                // close with router
            });
            client.on('error', function () {
                _this.logger.error('Client connection threw an error');
            });
        });
    };
    SocketServer.prototype.send = function (client, packet) {
        client.send(JSON.stringify(packet));
    };
    SocketServer.prototype.broadCast = function (packet) {
        var _this = this;
        this.server.clients.forEach(function (client) {
            if (_this.client_to_uid.get(client) !== null) {
                _this.send(client, packet);
            }
        });
    };
    SocketServer.PORT = 2000;
    return SocketServer;
}());
exports.SocketServer = SocketServer;
