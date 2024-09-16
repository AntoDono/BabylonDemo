import { AdvancedDynamicTexture, TextBlock, Control } from "@babylonjs/gui";

export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture;

  private _currentVersion: number = 14;
  private _baseSnippet: string = "UW33M7";
  private _healthBar: TextBlock;
  private _timer: TextBlock;
  private _time_elapsed: number = 0;
  private _target_sheep_amt: number = -1;
  private _completed: boolean = false;
  private _endGame: any;

  constructor(mainGUI: AdvancedDynamicTexture, endGame: any) {
    this._mainGUI = mainGUI;
    this._endGame = endGame;
  }

  public async init() {
    await this.load();
  }

  private async load() {
    await this._mainGUI.parseFromSnippetAsync(
      `${this._baseSnippet}#${this._currentVersion}`
    );

    {
      let health = new TextBlock();
      health.text = "Sheeps Collected: 0";
      health.name = "sheeps-collected";
      health.color = "pink";
      health.fontSize = 30;
      health.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      health.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      health.topInPixels = -450;
      this._mainGUI.addControl(health);
      this._healthBar = <TextBlock>this._mainGUI.getChildren()[0]._children[3];
    }

    {
      let timer = new TextBlock();
      timer.text = "Time elapsed: 0.00s";
      timer.name = "speedrun-timer";
      timer.color = "green";
      timer.fontSize = 25;
      timer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      timer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      timer.topInPixels = -500;
      this._mainGUI.addControl(timer);
      this._timer = <TextBlock>this._mainGUI.getChildren()[0]._children[4];
    }
  }

  public healthChange(new_health: number) {
    this._healthBar!.text = `Sheeps Collected: ${new_health} / ${
      this._target_sheep_amt
    }\n${"🐏".repeat(new_health)}`;
    if (new_health >= this._target_sheep_amt) {
      this._completed = true;
      this._endGame(this._time_elapsed);
      document.exitFullscreen()
    }
  }

  public addtime(milliseconds: number) {
    if (this._completed) return;
    this._time_elapsed += milliseconds / 1000.0;
    this._timer!.text = `Time elasped: ${this._time_elapsed.toFixed(2)}s`;
  }

  public set target_sheep_amt(sheep: number) {
    this._target_sheep_amt = sheep;
    this.healthChange(0);
  }
}
