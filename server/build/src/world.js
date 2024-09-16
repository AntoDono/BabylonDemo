"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var babylonjs_1 = require("babylonjs");
var logger_1 = require("./logger");
var generation_1 = require("./generation");
var state_machine_1 = require("./state_machine");
var OIMO = __importStar(require("oimo"));
// required imports
require("babylonjs-loaders");
// required imports
var xhr2_1 = __importDefault(require("xhr2"));
// @ts-ignore
global.XMLHttpRequest = xhr2_1.default.XMLHttpRequest;
var World = /** @class */ (function () {
    function World(sheeps) {
        this._tick_time = 5000; // in ms
        this._ticks_elapsed = 0;
        this.logger = new logger_1.Logger('World');
        this.worldSize = { top: new babylonjs_1.Vector3(5000, 10000, 5000), bottom: new babylonjs_1.Vector3(-5000, 0, -5000) };
        this.isday = true;
        this.alpha_time = 0;
        this._sheeps = 0;
        this._engine = new babylonjs_1.NullEngine();
        this._scene = new babylonjs_1.Scene(this._engine);
        this._scene.useRightHandedSystem = true;
        this._generator = new generation_1.Generation(this, this._scene);
        this._sheeps = sheeps;
        // console.log(this._ground.position)
    }
    Object.defineProperty(World.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(World.prototype, "_get_tick", {
        get: function () {
            var ticks = Math.round(this._ticks_elapsed / this._tick_time * 1000);
            this._ticks_elapsed = 0;
            return ticks;
        },
        enumerable: false,
        configurable: true
    });
    World.prototype.validateEntityPosition = function (entityPosition) {
        if ((entityPosition.x < this.worldSize.bottom.x || entityPosition.x > this.worldSize.top.x) ||
            (entityPosition.y < this.worldSize.bottom.y || entityPosition.y > this.worldSize.top.y) ||
            (entityPosition.z < this.worldSize.bottom.z || entityPosition.z > this.worldSize.top.z)) {
            console.log("EXCEEDED LIMITS: " + entityPosition + " compared to " + this.worldSize.bottom + " and " + this.worldSize.top);
            return new babylonjs_1.Vector3(0, 10, 0);
        }
        else
            return entityPosition;
    };
    World.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var camera, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var _this = this;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        camera = new babylonjs_1.ArcRotateCamera("Camera", 0, 0.8, 100, babylonjs_1.Vector3.Zero(), this._scene);
                        this._scene.enablePhysics(new babylonjs_1.Vector3(0, -9.81, 0), new babylonjs_1.OimoJSPlugin(true, 10, OIMO));
                        this._scene.executeWhenReady(function () {
                            _this.logger.progress("Scene is ready, running server side simulation");
                            _this._scene.beforeRender = function () {
                                var deltaTime = _this._scene.getEngine().getDeltaTime();
                                _this.alpha_time += (0.05 * deltaTime) / 1000;
                                _this.alpha_time = _this.alpha_time % (2 * Math.PI); // keeps alpha always between 0 - 2P
                                if (Math.cos(_this.alpha_time) > 0 && !_this.isday) {
                                    _this.isday = true;
                                }
                                else if (Math.cos(_this.alpha_time) < 0 && _this.isday) {
                                    _this.isday = false;
                                }
                            };
                            _this._engine.runRenderLoop(function () {
                                _this._scene.render();
                                _this._ticks_elapsed++;
                                state_machine_1.state_machine.update();
                                // for (let uid of state_machine.entities.keys()){
                                //     let entity: Entities = state_machine.entities.get(uid);
                                //     console.log(entity.object.rotationQuaternion)
                                // }
                            });
                        });
                        this.logger.interval_logger(this._tick_time, function () {
                            _this.logger.progress("Avg Server tick (".concat(_this._tick_time, " ms): ").concat(_this._get_tick));
                        });
                        state_machine_1.state_machine.setWorld(this);
                        this._ground = babylonjs_1.MeshBuilder.CreateGround("ground", { width: 10000, height: 10000 }, this._scene);
                        this._ground.position = new babylonjs_1.Vector3(0, 0, 0);
                        this._ground.physicsImpostor = new babylonjs_1.PhysicsImpostor(this._ground, babylonjs_1.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene);
                        // this._generator.RANDOMIZE(this._generator.GENERATE.Cylinder(new Vector3(0, 0, 0)), 100, 100)
                        // this._generator.RANDOMIZE(await this._generator.GENERATE.Tree2(new Vector3(0, 0, 0)),1, 1)
                        // this._generator.RANDOMIZE(this._generator.GENERATE.Box(new Vector3(0, 0, 0)), 100, 1000)
                        // this._generator.RANDOMIZE(await this._generator.GENERATE.House(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 100, 1000)
                        // this._generator.RANDOMIZE(await this._generator.GENERATE.Slope(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 1, 10)
                        /*BASIC WORLD */
                        _b = (_a = this._generator).RANDOMIZE;
                        return [4 /*yield*/, this._generator.GENERATE.Tree1(new babylonjs_1.Vector3(100, 0, 100), new babylonjs_1.Vector3(0, 0, 0))];
                    case 1:
                        // this._generator.RANDOMIZE(this._generator.GENERATE.Cylinder(new Vector3(0, 0, 0)), 100, 100)
                        // this._generator.RANDOMIZE(await this._generator.GENERATE.Tree2(new Vector3(0, 0, 0)),1, 1)
                        // this._generator.RANDOMIZE(this._generator.GENERATE.Box(new Vector3(0, 0, 0)), 100, 1000)
                        // this._generator.RANDOMIZE(await this._generator.GENERATE.House(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 100, 1000)
                        // this._generator.RANDOMIZE(await this._generator.GENERATE.Slope(new Vector3(100, 0, 100), new Vector3(0, 0, 0)), 1, 10)
                        /*BASIC WORLD */
                        _b.apply(_a, [_o.sent(), 50, 1000]);
                        _d = (_c = this._generator).RANDOMIZE;
                        return [4 /*yield*/, this._generator.GENERATE.House(new babylonjs_1.Vector3(100, 0, 10), new babylonjs_1.Vector3(0, 0, 0))];
                    case 2:
                        _d.apply(_c, [_o.sent(), 50, 1000]);
                        _f = (_e = this._generator).RANDOMIZE;
                        return [4 /*yield*/, this._generator.GENERATE.House2(new babylonjs_1.Vector3(100, 0, 100), new babylonjs_1.Vector3(0, 0, 0))];
                    case 3:
                        _f.apply(_e, [_o.sent(), 50, 1000]);
                        _h = (_g = this._generator).RANDOMIZE;
                        return [4 /*yield*/, this._generator.GENERATE.Crate(new babylonjs_1.Vector3(100, 0, 100), new babylonjs_1.Vector3(0, 0, 0))];
                    case 4:
                        _h.apply(_g, [_o.sent(), 1, 100]);
                        _k = (_j = this._generator).RANDOMIZE;
                        return [4 /*yield*/, this._generator.GENERATE.Sheep(new babylonjs_1.Vector3(100, 0, 100), new babylonjs_1.Vector3(0, 0, 0))];
                    case 5:
                        _k.apply(_j, [_o.sent(), this._sheeps, 500]);
                        _m = (_l = this._generator).RANDOMIZE;
                        return [4 /*yield*/, this._generator.GENERATE.Fountain(new babylonjs_1.Vector3(50, 0, 50), new babylonjs_1.Vector3(0, 0, 0))];
                    case 6:
                        _m.apply(_l, [_o.sent(), 0, 0]);
                        return [2 /*return*/];
                }
            });
        });
    };
    return World;
}());
exports.World = World;
