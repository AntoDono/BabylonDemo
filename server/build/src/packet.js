"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = exports.PacketType = void 0;
var PacketType;
(function (PacketType) {
    PacketType["update"] = "Update";
    PacketType["info"] = "Info";
    PacketType["movement"] = "Movement";
    PacketType["mesh"] = "Mesh";
    PacketType["close"] = "Close";
    PacketType["interaction"] = "Interaction";
    PacketType["chat"] = "Chat";
    PacketType["player_creation"] = "PlayerCreation";
    PacketType["request_mesh"] = "RequestMesh";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
var Packet = /** @class */ (function () {
    function Packet(packetType, data, uid) {
        this.type = packetType;
        this.payload = data;
        if (uid)
            this.uid = uid;
    }
    return Packet;
}());
exports.Packet = Packet;
