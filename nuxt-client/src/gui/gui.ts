import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";
import { Hotbar } from "./hotbar";

export class GUI {
  private _mainGUI: AdvancedDynamicTexture;
  private _scene: Scene;
  private _hotbar: Hotbar;

  constructor(scene: Scene, endGame: any) {
    this._scene = scene;
    this._mainGUI = AdvancedDynamicTexture.CreateFullscreenUI(
      "main-gui",
      true,
      this._scene
    );
    this._hotbar = new Hotbar(this._mainGUI, endGame);
    this._hotbar.init();
  }

  public get hotbar(): Hotbar {
    return this._hotbar;
  }

  public disposeGUI() {
    this._mainGUI.dispose();
  }
}
