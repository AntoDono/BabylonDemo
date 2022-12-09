import { AdvancedDynamicTexture } from "@babylonjs/gui"
import { PlayerItem } from "./items"


export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture
  private _currentSlot: number = 0
  private _slots: Map<number, PlayerItem>
  private _currentVersion: number = 9
  private _baseSnippet: string = "UW33M7"

  constructor(mainGUI: AdvancedDynamicTexture) {
    this._mainGUI = mainGUI
    this._slots = new Map()
  }

  private async load() {
    await this._mainGUI.parseFromSnippetAsync(`${this._baseSnippet}#${this._currentVersion}`)
  }

  public async init() {
    await this.load()
  }

  // on scroll wheel
  public async increment() {
    
  }

  public async decrement() {

  }

  public add(item: PlayerItem, slot: number): boolean {
    /* if (!slot) {
      for (let i = 0; i < 0; i++) {
        if (!this._slots.has(i)) {
          slot = i 
          break
        }
      }
    }
    
    if (slot) {
      this._slots.set(slot, item)
      return true
    } else {
      return false
    } */
    this._slots.set(slot, item)
    return true
  }

  
  public get current(): any {
    return this._slots.get(this._currentSlot)
  }
  
  public set current(slot: number) {
    this._currentSlot = slot
  }
}